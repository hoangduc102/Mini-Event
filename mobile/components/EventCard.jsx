import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { useEventStore } from '../store/eventStore';

const DEFAULT_IMAGE = 'https://via.placeholder.com/400x200/EEEEEE/999999?text=No+Image';

const EventCard = ({ event }) => {
  const [isJoining, setIsJoining] = useState(false);
  const router = useRouter();
  const { token } = useAuthStore();
  const { registerEvent } = useEventStore();
  const [qrImage, setQrImage] = useState(null);
  // Format date string
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const navigateToEventDetail = () => {
    router.push({
      pathname: `/events/${event.id}`,
      params: { id: event.id }
    });
  };

  const handleJoinEvent = async () => {
    if (!token) {
      Alert.alert(
        'Thông báo',
        'Vui lòng đăng nhập để tham gia sự kiện',
        [
          {
            text: 'Đăng nhập',
            onPress: () => router.push('/login')
          },
          {
            text: 'Hủy',
            style: 'cancel'
          }
        ]
      );
      return;
    }

    try {
      setIsJoining(true);
      const result = await registerEvent(event.id);
      
      if (result.success) {
        setQrImage(result.data);
        console.log('QR Code Image:', result.data);
        Alert.alert('Thành công', 'Đăng ký tham gia sự kiện thành công!');
        navigateToEventDetail();
      } else {
        Alert.alert('Lỗi', result.error || 'Không thể đăng ký tham gia sự kiện');
      }
    } catch (error) {
      Alert.alert('Lỗi', error.message || 'Đã xảy ra lỗi khi đăng ký');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={navigateToEventDetail}
    >
      <Image
        source={{ uri: qrImage || event.image || DEFAULT_IMAGE }}
        style={styles.image}
        onError={() => {
          console.warn("Không tải được ảnh");
        }}
      />
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {event.name}
        </Text>
        <View style={styles.detailsContainer}>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={14} color="#666" />
            <Text style={styles.date}>{formatDate(event.date)}</Text>
          </View>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={14} color="#666" />
            <Text style={styles.location} numberOfLines={1}>
              {event.address || 'Chưa có địa chỉ'}
            </Text>
          </View>
          {event.eventTag && (
            <View style={styles.tagContainer}>
              <Ionicons name="pricetag-outline" size={14} color="#666" />
              <Text style={styles.tag}>{event.eventTag}</Text>
            </View>
          )}
        </View>
      </View>
      
      {/* <TouchableOpacity
        style={[
          styles.button,
          event.isJoined && styles.joinedButton,
          isJoining && styles.joiningButton
        ]}
        onPress={handleJoinEvent}
        disabled={isJoining || event.isJoined}
      >
        {isJoining ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.buttonText}>
            {event.isJoined ? 'Đã tham gia' : 'Tham gia'}
          </Text>
        )}
      </TouchableOpacity> */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 6
  },
  detailsContainer: {
    gap: 4
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  date: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  location: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    marginLeft: 12
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'white'
  },
  joinedButton: {
    backgroundColor: '#4CAF50'
  },
  joiningButton: {
    backgroundColor: '#999'
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  tag: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4
  }
});

export default EventCard; 