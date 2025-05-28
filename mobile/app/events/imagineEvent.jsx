import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import styles from '../../assets/styles/eventDetail.style';
import { useRouter } from 'expo-router';

export default function ImagineEvent() {
  const router = useRouter();
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const handleBarCodeScanned = ({ data }) => {
    setShowScanner(false);
    // Xử lý dữ liệu QR code ở đây
    alert(`Mã QR đã được quét thành công: ${data}`);
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

  if (showScanner) {
    return (
      <View style={{ flex: 1 }}>
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
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
        <View style={styles.imagePlaceholder}>
          <Text style={[styles.imageText, { fontSize: 36 }]}>IMAGINE</Text>
        </View>

        {/* Event Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>Shere Bangla Concert</Text>
          <View style={styles.row}>
            <Ionicons name="location-outline" size={16} color="orange" />
            <Text style={styles.smallText}>ABC Avenue, Dhaka</Text>
            <Ionicons name="calendar-outline" size={16} color="orange" style={{ marginLeft: 10 }} />
            <Text style={styles.smallText}>25-27 October, 22</Text>
          </View>
          <View style={[styles.row, { marginTop: 8 }]}> 
            <Text style={styles.smallText}>15.7k+</Text>
            <TouchableOpacity style={styles.viewAllButton} onPress={() => router.push('/events/listGuest')}>
              <Text style={styles.viewAllText}>VIEW ALL / INVITE</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Organizer */}
        <View style={styles.organizerContainer}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/40?img=5' }}
            style={styles.organizerImage}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.organizerName}>Tamim Ikram</Text>
            <Text style={styles.smallText}>Event Organiser</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="chatbubble-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 16 }}>
            <Ionicons name="call-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText} numberOfLines={showFullDesc ? undefined : 3}>
            Ultricies arcu venenatis in lorem faucibus lobortis at. Est odio varius nisl congue aliquam nunc est sit pull convallis magna. Est scelerisque dignissim non nibh.Ultricies arcu venenatis in lorem faucibus lobortis at. Est odio varius nisl congue aliquam nunc est sit pull convallis magna. Est scelerisque dignissim non nibh. Ultricies arcu venenatis in lorem faucibus lobortis at. Est odio varius nisl congue aliquam nunc est sit pull convallis magna. Est scelerisque dignissim non nibh
          </Text>
          <TouchableOpacity onPress={() => setShowFullDesc(v => !v)}>
            <Text style={styles.readMore}>{showFullDesc ? 'Show Less' : 'Read More'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* Button cố định dưới cùng */}
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#fff', paddingBottom: 18, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#ECECEC' }}>
        <TouchableOpacity style={styles.button} onPress={startScanning}>
          <Text style={styles.buttonText}>SCAN QR CODE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 