import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../assets/styles/event.styles';

// Hàm format ngày
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Hàm format giờ
const formatTime = (dateString) => {
  if (!dateString) return '9:00 PM';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '9:00 PM';
    
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    
    const formattedTime = `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
    console.log('Original date:', dateString, 'Formatted time:', formattedTime);
    return formattedTime;
  } catch (error) {
    console.error('Error formatting time:', error);
    return '9:00 PM';
  }
};

export default function TicketModal({ visible, onClose, eventDetail, user, qrImage  }) {
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const handleGPSCheck = () => {
    // Giả lập việc check GPS location
    Alert.alert(
      "Check-in thành công",
      "Bạn đã check-in thành công tại sự kiện!",
      [{ text: "OK" }]
    );
    setIsCheckedIn(true);
  };

  if (!eventDetail || !user) return null;
  console.log('Event Detail:', eventDetail);

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

          {/* <View style={styles.ticketImagePlaceholder} /> */}
          {/* Hiển thị mã QR thay vì placeholder */}
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
          <Text style={styles.ticketNote}>Scan your barcode at the entry gate.</Text>
          <View style={styles.ticketButtonRow}>
            <TouchableOpacity style={styles.ticketActionButton} onPress={onClose}>
              <Text>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.ticketActionButton,
                isCheckedIn && { opacity: 0.5 }
              ]} 
              onPress={handleGPSCheck}
              disabled={isCheckedIn}
            >
              <Ionicons name="location-outline" size={18} />
              <Text> GPS Check</Text>
              {isCheckedIn && (
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