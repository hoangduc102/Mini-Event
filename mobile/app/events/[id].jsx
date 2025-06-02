import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEventStore } from '../../store/eventStore';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../assets/styles/event.styles';
import TicketModal from './TicketModal';

const COLORS = {
  primary: '#4F46E5',
  secondary: '#64748B',
  text: '#1E293B',
};

// Format date helper function
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) throw new Error('Invalid date');
    
    const options = { 
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

const ParticipantAvatars = ({ participants }) => {
  const maxDisplay = 4;
  const remainingCount = participants?.length - maxDisplay;

  return (
    <View style={styles.participantsContainer}>
      {participants?.slice(0, maxDisplay).map((participant, index) => (
        <Image
          key={index}
          source={{ uri: participant.avatar || 'https://i.pravatar.cc/100?img=' + index }}
          style={[
            styles.participantAvatar,
            { marginLeft: index > 0 ? -10 : 0 }
          ]}
        />
      ))}
      {remainingCount > 0 && (
        <View style={[styles.participantAvatar, styles.remainingCount, { marginLeft: -10 }]}>
          <Text style={styles.remainingCountText}>+{remainingCount}</Text>
        </View>
      )}
    </View>
  );
};

export default function EventDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [eventDetail, setEventDetail] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const { getEventDetail, isLoading, error } = useEventStore();
  const [showTicket, setShowTicket] = useState(false);
  const user = { name: 'Indriyani Puspita', phone: '0987654321' };
  const [qrImage, setQrImage] = useState(null);
  useEffect(() => {
    const loadEventDetail = async () => {
      if (!id) return;
      
      try {
        const result = await getEventDetail(id);
        if (result.success) {
          setEventDetail(result.data);
        } else {
          console.error('Failed to load event detail:', result.error);
        }
      } catch (error) {
        console.error('Error loading event detail:', error);
      }
    };

    loadEventDetail();
  }, [id, getEventDetail]);

  const handleBack = () => {
    router.back();
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleGetTicket = async () => {
  try {
    const result = await useEventStore.getState().registerEvent(id);
    if (result.success) {
      setQrImage(result.data); // Đây là imageDataUrl base64
      setShowTicket(true);
    } else {
      console.error('Đăng ký thất bại:', result.error);
      setQrImage(null);
      setShowTicket(true);
    }
  } catch (error) {
    console.error('Lỗi khi đăng ký:', error);
    setQrImage(null);
    setShowTicket(true);
  }
};

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Đang tải thông tin sự kiện...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => getEventDetail(id)}>
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!eventDetail) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Không tìm thấy thông tin sự kiện</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={24} 
            color={isFavorite ? "#EF4444" : "#1a1a1a"} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Image 
          source={eventDetail.image ? { uri: eventDetail.image } : require('../../assets/images/App-logo.png')}
          style={styles.eventDetailImage}
        />

        <View style={styles.eventDetailContent}>
          <Text style={styles.eventDetailTitle}>{eventDetail.name}</Text>
          
          <View style={styles.eventDetailSection}>
            {/* <View style={styles.iconContainer}>
              <Ionicons name="calendar-outline" size={20} color={COLORS.secondary} />
            </View> */}
            <View style={styles.sectionContent}>
              <Text style={styles.sectionLabel}>Thời gian</Text>
              <Text style={styles.eventDetailText}>
                {formatDate(eventDetail.date)}
              </Text>
            </View>
          </View>

          <View style={styles.eventDetailSection}>
            {/* <View style={styles.iconContainer}>
              <Ionicons name="location-outline" size={20} color={COLORS.secondary} />
            </View> */}
            <View style={styles.sectionContent}>
              <Text style={styles.sectionLabel}>Địa điểm</Text>
              <Text style={styles.eventDetailText}>
                {eventDetail.address}
              </Text>
            </View>
          </View>

          {eventDetail.participants && eventDetail.participants.length > 0 && (
            <View style={styles.participantsSection}>
              <Text style={styles.sectionLabel}>Người tham gia</Text>
              <ParticipantAvatars participants={eventDetail.participants} />
            </View>
          )}

          {eventDetail.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.descriptionTitle}>Mô tả</Text>
              <Text style={styles.descriptionText}>
                {eventDetail.description}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.chatButton}>
          <Ionicons name="chatbubble-outline" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.callButton}>
          <Ionicons name="call-outline" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.getTicketButton} onPress={handleGetTicket}>
          <Text style={styles.getTicketText}>GET TICKET</Text>
        </TouchableOpacity>
      </View>
      <TicketModal
        visible={showTicket}
        onClose={() => setShowTicket(false)}
        eventDetail={eventDetail}
        user={user}
        qrImage={qrImage}
      />
    </SafeAreaView>
  );
} 