import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../assets/styles/event.styles';
import * as Location from 'expo-location';
import { useAuthStore } from '../../store/authStore';
import Toast from 'react-native-toast-message'; // ✅ thêm dòng này

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const formatTime = (dateString) => {
  if (!dateString) return '9:00 PM';
  try {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
  } catch {
    return '9:00 PM';
  }
};

export default function TicketModal({ visible, onClose, eventDetail, user, qrImage }) {
  const [isChecking, setIsChecking] = useState(false);
  const { checkinGPS, isEventCheckedIn, loadCheckedInEvents } = useAuthStore();

  // Load trạng thái check-in khi component mount
  useEffect(() => {
    if (visible && eventDetail?.id) {
      loadCheckedInEvents();
    }
  }, [visible, eventDetail?.id]);

  const handleGPSCheck = async () => {
    try {
      // Kiểm tra xem đã check-in chưa
      if (isEventCheckedIn(eventDetail.id)) {
        Toast.show({
          type: 'info',
          text1: 'Thông báo',
          text2: 'Bạn đã check-in sự kiện này rồi',
          visibilityTime: 2000,
        });
        return;
      }

      setIsChecking(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({
          type: 'error',
          text1: 'Không có quyền vị trí',
          text2: 'Bạn cần cho phép truy cập GPS để check-in.',
          visibilityTime: 2000,
        });
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      const result = await checkinGPS(eventDetail.id, latitude, longitude);
      if (result.success) {
        Toast.show({
          type: 'success',
          text1: '✅ Check-in thành công!',
          visibilityTime: 2000,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: '❌ Check-in thất bại',
          text2: result.error || 'Không thể check-in',
          visibilityTime: 2000,
        });
      }
    } catch (error) {
      console.error('GPS Check-in error:', error);
      Toast.show({
        type: 'error',
        text1: '⚠️ Lỗi hệ thống',
        text2: 'Không thể lấy vị trí hoặc gửi check-in.',
        visibilityTime: 2000,
      });
    } finally {
      setIsChecking(false);
    }
  };

  if (!eventDetail || !user) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.ticketModalOverlay}>
        <View style={styles.ticketModalContainer}>
          <TouchableOpacity style={styles.ticketDownloadButton}>
            <Ionicons name="download-outline" size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.ticketFavoriteButton}>
            <Ionicons name="heart" size={24} color="#A52A2A" />
          </TouchableOpacity>

          {qrImage ? (
            <Image
              source={{ uri: qrImage }}
              style={{ width: 180, height: 180, alignSelf: 'center', marginVertical: 16 }}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.ticketImagePlaceholder} />
          )}

          <Text style={styles.ticketTitle}>{eventDetail.name}</Text>
          <Text style={styles.ticketSubtitle}>
            {formatDate(eventDetail.date)} ~ {eventDetail.address}
          </Text>

          <View style={styles.ticketInfoRow}>
            <View>
              <Text style={styles.ticketLabel}>Tag</Text>
              <Text style={styles.ticketValue}>{eventDetail.eventTag || 'Unknown'}</Text>
            </View>
            <View>
              <Text style={styles.ticketLabel}>Phone Number</Text>
              <Text style={styles.ticketValue}>{user.phone}</Text>
            </View>
          </View>

          <View style={styles.ticketInfoRow}>
            <View>
              <Text style={styles.ticketLabel}>Date</Text>
              <Text style={styles.ticketValue}>{formatDate(eventDetail.date)}</Text>
            </View>
            <View>
              <Text style={styles.ticketLabel}>Time</Text>
              <Text style={styles.ticketValue}>{formatTime(eventDetail.date)}</Text>
            </View>
          </View>

          <Text style={styles.ticketNote}>
            {isEventCheckedIn(eventDetail.id) 
              ? 'Bạn đã check-in sự kiện này rồi.' 
              : 'Quét mã QR hoặc sử dụng GPS để check-in.'}
          </Text>

          <View style={styles.ticketButtonRow}>
            <TouchableOpacity style={styles.ticketActionButton} onPress={onClose}>
              <Text>Đóng</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.ticketActionButton,
                isEventCheckedIn(eventDetail.id) && { opacity: 0.5 }
              ]}
              onPress={handleGPSCheck}
              disabled={isEventCheckedIn(eventDetail.id) || isChecking}
            >
              <Ionicons name="location-outline" size={18} />
              <Text> GPS Check</Text>
              {isEventCheckedIn(eventDetail.id) && (
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color="green"
                  style={{ marginLeft: 5 }}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
