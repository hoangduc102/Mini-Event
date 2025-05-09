import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'expo-router';
import styles from '../../assets/styles/home.styles';
import COLORS from '../../constants/colors';
import ResponsiveInfo from '../../components/ResponsiveInfo';
import { useState } from 'react';

export default function Home() {
  const { user } = useAuthStore();
  const [showAllEvents, setShowAllEvents] = useState(false);

  const upcomingEvents = [
    {
      id: 1,
      day: '15',
      month: 'APR',
      title: 'Tech Conference 2024',
      location: 'District 1, HCMC',
      attendees: '150',
      time: '09:00 AM'
    },
    {
      id: 2,
      day: '15',
      month: 'APR',
      title: 'Tech Conference 2024',
      location: 'District 1, HCMC',
      attendees: '150',
      time: '09:00 AM'
    },
    {
      id: 3,
      day: '20',
      month: 'APR',
      title: 'Design Workshop 2024',
      location: 'District 2, HCMC',
      attendees: '80',
      time: '14:00 PM'
    },
    {
      id: 4,
      day: '25',
      month: 'APR',
      title: 'Startup Meetup 2024',
      location: 'District 3, HCMC',
      attendees: '120',
      time: '10:00 AM'
    }
  ];

  const displayedEvents = showAllEvents ? upcomingEvents : upcomingEvents.slice(0, 2);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* <ResponsiveInfo /> */}
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image 
            source={user?.profileImage ? { uri: user.profileImage } : require('../../assets/images/App-logo.png')}
            style={styles.avatar}
            defaultSource={require('../../assets/images/App-logo.png')}
          />
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
          <Text style={styles.sectionTitle}>Hot Events</Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
            <MaterialIcons name="arrow-forward-ios" size={14} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[1, 2, 3].map((item) => (
            <TouchableOpacity key={item} style={styles.eventCard}>
              <LinearGradient
                colors={['#FF6B6B', '#FF8E53']}
                style={styles.eventCardGradient}
              >
                <View style={styles.eventCardContent}>
                  <View style={styles.eventInfo}>
                    <Text style={styles.eventDate}>APR 15</Text>
                    <Text style={styles.eventTitle}>Music Festival 2024</Text>
                    <Text style={styles.eventLocation}>
                      <Ionicons name="location-outline" size={14} color="#FFF" />
                      {' Ho Chi Minh City'}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.joinButton}>
                    <Text style={styles.joinButtonText}>Join Now</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Upcoming Events Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
            <MaterialIcons name="arrow-forward-ios" size={14} color="#666" />
          </TouchableOpacity>
        </View>

        {displayedEvents.map((event) => (
          <TouchableOpacity key={event.id} style={styles.upcomingEventCard}>
            <View style={styles.upcomingEventDate}>
              <Text style={styles.upcomingEventDay}>{event.day}</Text>
              <Text style={styles.upcomingEventMonth}>{event.month}</Text>
            </View>
            <View style={styles.upcomingEventInfo}>
              <Text style={styles.upcomingEventTitle}>{event.title}</Text>
              <Text style={styles.upcomingEventLocation}>
                <Ionicons name="location-outline" size={14} color="#666" />
                {' ' + event.location}
              </Text>
              <View style={styles.upcomingEventStats}>
                <Text style={styles.upcomingEventAttendees}>
                  <Ionicons name="people-outline" size={14} color="#666" />
                  {' ' + event.attendees + ' Attendees'}
                </Text>
                <Text style={styles.upcomingEventTime}>
                  <Ionicons name="time-outline" size={14} color="#666" />
                  {' ' + event.time}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

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
      </View>

      {/* Create Event Section */}
      <TouchableOpacity style={styles.createEventSection}>
        <LinearGradient
          colors={['#4A90E2', '#5C6BC0']}
          style={styles.createEventGradient}
        >
          <View style={styles.createEventContent}>
            <Text style={styles.createEventTitle}>Create Your Own Event</Text>
            <Text style={styles.createEventDescription}>
              Start planning your next amazing event today
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

