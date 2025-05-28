import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import styles from '../../assets/styles/eventDetail.style';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Buffer } from 'buffer'; // thêm đầu file
import { useAuthStore } from '../../store/authStore';
import Toast from 'react-native-toast-message';
export default function ImagineEvent() {
  const router = useRouter();
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const { event: eventBase64 } = useLocalSearchParams();
  const {checkinQrCode} = useAuthStore();
  const [isHandlingScan, setIsHandlingScan] = useState(false);
  let event = null;
  try {
    const decoded = Buffer.from(eventBase64, 'base64').toString('utf-8');
    event = JSON.parse(decoded);
  } catch (e) {
    console.error('Không parse được event:', e);
  }

  if (!event) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Không tìm thấy thông tin sự kiện</Text>
      </View>
    );
  }

  const handleBarCodeScanned = async ({ data }) => {
    if (isHandlingScan) return;

    setIsHandlingScan(true); // Khóa xử lý để không spam

    try {
      const result = await checkinQrCode(event.id, data);
      Toast.show({
        type: result.success ? 'success' : 'error',
        text1: result.success ? '✅ Check-in thành công!' : '❌ Check-in thất bại',
        text2: result.error || '',
        visibilityTime: 1500,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: '⚠️ Lỗi kết nối',
        text2: error.message || 'Vui lòng thử lại sau',
        visibilityTime: 1500,
      });
    } finally {
      setTimeout(() => {
        setIsHandlingScan(false);
      }, 1800); 
    }
  };

  const startScanning = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        alert('Cần quyền truy cập camera để quét mã QR');
        return;
      }
    }
    setShowScanner(true);
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  if (showScanner) {
    return (
      <View style={{ flex: 1 }}>
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={handleBarCodeScanned}
        >
          <View style={{ flex: 1, backgroundColor: 'transparent' }}>
            <TouchableOpacity 
              style={{ position: 'absolute', top: 40, left: 20, backgroundColor: 'white', padding: 10, borderRadius: 5 }}
              onPress={() => setShowScanner(false)}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ width: 250, height: 250, borderWidth: 2, borderColor: 'white', borderRadius: 10 }} />
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 150 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="heart" size={24} color="#7B241C" />
          </TouchableOpacity>
        </View>

        {/* Event Image */}
        {event.image ? (
          <Image source={{ uri: event.image }} style={styles.imagePlaceholder} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={[styles.imageText, { fontSize: 36 }]}>IMAGINE</Text>
          </View>
        )}

        {/* Event Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{event.name}</Text>
          <View style={styles.row}>
            <Ionicons name="location-outline" size={16} color="orange" />
            <Text style={styles.smallText}>{event.address}</Text>
            <Ionicons name="calendar-outline" size={16} color="orange" style={{ marginLeft: 10 }} />
            <Text style={styles.smallText}>{formatDate(event.date)}</Text>
          </View>
          <View style={[styles.row, { marginTop: 8 }]}> 
            <Text style={styles.smallText}>{event.limit}</Text>
            <TouchableOpacity style={styles.viewAllButton} onPress={() => router.push('/events/listGuest')}>
              <Text style={styles.viewAllText}>VIEW ALL / INVITE</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Organizer
        <View style={styles.organizerContainer}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/40?img=5' }}
            style={styles.organizerImage}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.organizerName}>Organized by</Text>
            <Text style={styles.smallText}>{event.createdBy}</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="chatbubble-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 16 }}>
            <Ionicons name="call-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View> */}

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText} numberOfLines={showFullDesc ? undefined : 3}>
            {event.description || 'Không có mô tả'}
          </Text>
          <TouchableOpacity onPress={() => setShowFullDesc(v => !v)}>
            <Text style={styles.readMore}>{showFullDesc ? 'Show Less' : 'Read More'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Fixed Button */}
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#fff', paddingBottom: 18, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#ECECEC' }}>
        <TouchableOpacity style={styles.button} onPress={startScanning}>
          <Text style={styles.buttonText}>SCAN QR CODE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
