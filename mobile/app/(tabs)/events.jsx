import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { styles } from '../../assets/styles/event.styles'
import { useRouter } from 'expo-router'
import { useEventStore } from '../../store/eventStore'
import { useAuthStore } from '../../store/authStore'
import { Buffer } from 'buffer'; // nếu bạn chưa có
const COLORS = {
  primary: '#4F46E5',
  secondary: '#64748B',
  text: '#1E293B',
}

// Cache months array
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Pure function không sử dụng hooks
const formatDateString = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) throw new Error('Invalid date');
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = MONTHS[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month}, ${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

const StatusBadge = React.memo(({ status }) => (
  <View style={[
    styles.statusBadge,
    status === 'upcoming' ? styles.upcomingBadge : styles.completedBadge
  ]}>
    <Text style={styles.statusBadgeText}>
      {status === 'upcoming' ? 'Upcoming' : 'Completed'}
    </Text>
  </View>
));

const EventCard = React.memo(({ title, date, location, status, onPress, image, buttonText = 'VIEW' }) => {
  const formattedDate = useMemo(() => formatDateString(date), [date]);
  
  return (
    <View style={styles.eventCard}>
      <Image 
        source={image ? { uri: image } : require('../../assets/images/App-logo.png')}
        style={styles.eventImage}
      />
      <View style={styles.eventInfo}>
        {status && <StatusBadge status={status} />}
        <Text style={styles.eventTitle} numberOfLines={2}>{title}</Text>
        <Text style={styles.eventDate}>{formattedDate}</Text>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color={COLORS.secondary} />
          <Text style={styles.locationText} numberOfLines={1}>{location}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.showDetailButton} onPress={onPress}>
        <Text style={styles.showDetailText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
});

const EventSection = React.memo(({ title, events, type }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const router = useRouter();

  const handleEventPress = useCallback((event, index) => {
    if (title === 'My Events') {
      const encoded = Buffer.from(JSON.stringify(event)).toString('base64');
      router.push({
        pathname: '/events/imagineEvent',
        params: { event: encoded },
      });
    } else {
      router.push(`/events/${event.id}`);
    }
  }, [router, title]);

  const filteredEvents = useMemo(() => {
    if (type !== 'myEvents') return events;

    const now = new Date();
    return events.filter(event => {
      try {
        const eventDate = new Date(event.date);
        return activeTab === 'upcoming' ? eventDate > now : eventDate <= now;
      } catch {
        return false;
      }
    });
  }, [events, type, activeTab]);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  return (
    <View style={{ marginBottom: 20 }}>
      <TouchableOpacity 
        onPress={toggleExpanded}
        style={styles.sectionHeader}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        <Ionicons 
          name={isExpanded ? "chevron-up" : "chevron-down"} 
          size={24} 
          color={COLORS.text}
        />
      </TouchableOpacity>
      
      {isExpanded && type === 'myEvents' && (
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[
              styles.tab,
              activeTab === 'upcoming' && styles.activeTab
            ]}
            onPress={() => handleTabChange('upcoming')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'upcoming' ? styles.activeTabText : styles.inactiveTabText
            ]}>
              Upcoming
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.tab,
              activeTab === 'completed' && styles.activeTab
            ]}
            onPress={() => handleTabChange('completed')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'completed' ? styles.activeTabText : styles.inactiveTabText
            ]}>
              Completed
            </Text>
          </TouchableOpacity>
        </View>
      )}
      
      {isExpanded && filteredEvents.map((event, idx) => (
        <EventCard 
          key={event.id} 
          title={event.name}
          date={event.date}
          location={event.address}
          status={type === 'myEvents' ? (new Date(event.date) > new Date() ? 'upcoming' : 'completed') : undefined}
          onPress={() => handleEventPress(event, idx)}
          image={event.image}
          buttonText={type === 'attended' ? 'GET TICKET' : 'VIEW'}
        />
      ))}
    </View>
  );
});

export default function Events() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  
  const { 
    myEvents,
    attendedEvents,
    isLoading,
    isLoadingAttended,
    error,
    attendedError,
    getMyEvents,
    getAttendedEvents,
    resetEvents
  } = useEventStore();

  const { token, user } = useAuthStore();

  const loadAllEvents = useCallback(async () => {
    if (!token || !user) {
      console.log('No token or user available');
      router.replace('/login');
      return;
    }

    try {
      console.log('Loading events...');
      const [myEventsResult, attendedEventsResult] = await Promise.all([
        getMyEvents(),
        getAttendedEvents()
      ]);

      console.log('My Events Result:', myEventsResult);
      console.log('Attended Events Result:', attendedEventsResult);

      if (!myEventsResult.success) {
        console.error('Failed to load my events:', myEventsResult.error);
      }

      if (!attendedEventsResult.success) {
        console.error('Failed to load attended events:', attendedEventsResult.error);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    }
  }, [getMyEvents, getAttendedEvents, token, user, router]);

  useEffect(() => {
    if (token && user) {
      loadAllEvents();
    }
  }, [loadAllEvents, token, user]);

  const handleRefresh = useCallback(async () => {
    if (!token || !user) {
      router.replace('/login');
      return;
    }
    
    setRefreshing(true);
    resetEvents();
    await loadAllEvents();
    setRefreshing(false);
  }, [resetEvents, loadAllEvents, token, user, router]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={handleBack}
          >
            <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Events</Text>
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={loadAllEvents} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={handleBack}
        >
          <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Events</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      >
        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={loadAllEvents} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        ) : myEvents.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={styles.noEventsText}>Bạn chưa có sự kiện nào</Text>
            <TouchableOpacity 
              style={styles.createEventButton}
              onPress={() => router.push('/create')}
            >
              <Text style={styles.createEventButtonText}>Tạo sự kiện mới</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <EventSection title="My Events" events={myEvents.map(item => item.event)} type="myEvents" />
        )}

        {isLoadingAttended ? (
          <View style={styles.loadingMore}>
            <ActivityIndicator size="small" color={COLORS.primary} />
          </View>
        ) : attendedError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Không thể tải danh sách sự kiện đã tham dự</Text>
            <TouchableOpacity onPress={getAttendedEvents} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        ) : attendedEvents.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={styles.noEventsText}>Bạn chưa tham gia sự kiện nào</Text>
          </View>
        ) : (
          <EventSection title="Events attended" events={attendedEvents} type="attended" />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
