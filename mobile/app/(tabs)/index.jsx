import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { Link, useRouter } from 'expo-router';
import { SvgUri } from 'react-native-svg';
import styles from '../../assets/styles/home.styles';
import COLORS from '../../constants/colors';
import { useState, useEffect, useCallback } from 'react';

export default function Home() {
  const { user, getEvents, token } = useAuthStore();
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Lấy danh sách sự kiện khi component mount
  useEffect(() => {
    loadEvents();
  }, [token]);

  const loadEvents = async () => {
    if (!token) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const result = await getEvents(false);
      if (result.success && result.data) {
        setEvents(result.data);
      } else {
        setError(result.error || 'Unable to load events list');
      }
    } catch (error) {
      console.error('Failed to load events:', error);
      setError('An error occurred while loading the events list');
    } finally {
      setIsLoading(false);
    }
  };

  // Chuyển đổi event từ API sang format hiển thị
  const formatEventForDisplay = (event) => {
    const date = new Date(event.date);
    return {
      id: event.id,
      day: date.getDate().toString(),
      month: date.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
      title: event.name,
      location: event.address,
      attendees: event.limit.toString(),
      time: date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' }),
      image: event.image,
      eventTag: event.eventTag
    };
  };

  const displayedEvents = showAllEvents ? events : events.slice(0, 2);
  const hotEvents = events.slice(0, 3); // Lấy 3 sự kiện đầu tiên làm hot events

  const handleEventPress = useCallback((eventId) => {
    router.push({
      pathname: `/events/${eventId}`,
      params: { id: eventId }
    });
  }, [router]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadEvents}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* <ResponsiveInfo /> */}
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {user?.image?.endsWith('.svg') ? (
            <View style={styles.avatar}>
              <SvgUri
                width="100%"
                height="100%"
                uri={user.image}
              />
            </View>
          ) : (
            <Image 
              source={user?.image ? { uri: user.image } : require('../../assets/images/App-logo.png')}
              style={styles.avatar}
              defaultSource={require('../../assets/images/App-logo.png')}
            />
          )}
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>Hello,</Text>
            <Text style={styles.username} numberOfLines={1}>{user?.username || 'Guest'}</Text>
            <Text style={styles.emoji}>👋</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationCount}>2</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Hot Events Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Events</Text>
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => router.push('../events/hotEvents')}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <MaterialIcons name="arrow-forward-ios" size={14} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {hotEvents.map((event) => {
            const formattedEvent = formatEventForDisplay(event);
            return (
              <TouchableOpacity key={event.id} style={styles.eventCard}>
                <LinearGradient
                  colors={['#FF6B6B', '#FF8E53']}
                  style={styles.eventCardGradient}
                >
                  <View style={styles.eventCardContent}>
                    <View style={styles.eventInfo}>
                      <View style={styles.eventTopContent}>
                        <Text style={styles.eventDate}>
                          {formattedEvent.month} {formattedEvent.day}
                        </Text>
                        <Text style={styles.eventTitle} numberOfLines={2}>
                          {formattedEvent.title}
                        </Text>
                        <Text style={styles.eventLocation} numberOfLines={1}>
                          <Ionicons name="location-outline" size={14} color="#FFF" />
                          {' ' + formattedEvent.location}
                        </Text>
                      </View>
                      <View style={styles.eventBottomContent}>
                        <TouchableOpacity 
                          style={styles.joinButton}
                          onPress={() => handleEventPress(event.id)}
                        >
                          <Text style={styles.joinButtonText}>Join</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Upcoming Events Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => router.push('../events/upcomingEvents')}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <MaterialIcons name="arrow-forward-ios" size={14} color="#666" />
          </TouchableOpacity>
        </View>

        {displayedEvents.map((event) => {
          const formattedEvent = formatEventForDisplay(event);
          return (
            <TouchableOpacity 
              key={event.id} 
              style={styles.upcomingEventCard}
              onPress={() => handleEventPress(event.id)}
            >
              <View style={styles.upcomingEventDate}>
                <Text style={styles.upcomingEventDay}>{formattedEvent.day}</Text>
                <Text style={styles.upcomingEventMonth}>{formattedEvent.month}</Text>
              </View>
              <View style={styles.upcomingEventInfo}>
                <Text style={styles.upcomingEventTitle}>{formattedEvent.title}</Text>
                <Text style={styles.upcomingEventLocation}>
                  <Ionicons name="location-outline" size={14} color="#666" />
                  {' ' + formattedEvent.location}
                </Text>
                <View style={styles.upcomingEventStats}>
                  <Text style={styles.upcomingEventTime}>
                    <Ionicons name="time-outline" size={14} color="#666" />
                    {' ' + formattedEvent.time}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {events.length > 2 && (
          <TouchableOpacity 
            style={styles.showMoreButton}
            onPress={() => setShowAllEvents(!showAllEvents)}
          >
            <MaterialIcons 
              name={showAllEvents ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
              size={24} 
              color="#666" 
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Create Event Section */}
      <TouchableOpacity style={styles.createEventSection}>
        <LinearGradient
          colors={['#4A90E2', '#5C6BC0']}
          style={styles.createEventGradient}
        >
          <View style={styles.createEventContent}>
            <Text style={styles.createEventTitle}>Create Your Event</Text>
            <Text style={styles.createEventDescription}>
              Start planning your next amazing event
            </Text>
            <TouchableOpacity style={styles.createEventButton}>
              <Link href='/create' asChild>
                <Text style={styles.createEventButtonText}>Create Event</Text>
              </Link>
              <MaterialIcons name="arrow-forward" size={20} color="#4A90E2" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

