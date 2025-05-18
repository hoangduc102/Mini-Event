import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { styles } from '../../assets/styles/event.styles'
import { useRouter } from 'expo-router'

const COLORS = {
  primary: '#4F46E5',
  secondary: '#64748B',
  text: '#1E293B',
}

const StatusBadge = ({ status }) => (
  <View style={[
    styles.statusBadge,
    status === 'upcoming' ? styles.upcomingBadge : styles.completedBadge
  ]}>
    <Text style={styles.statusBadgeText}>
      {status === 'upcoming' ? 'Upcoming' : 'Completed'}
    </Text>
  </View>
)

const EventCard = ({ title, date, location, status }) => (
  <View style={styles.eventCard}>
    <Image 
      source={require('../../assets/images/App-logo.png')}
      style={styles.eventImage}
    />
    <View style={styles.eventInfo}>
      {status && <StatusBadge status={status} />}
      <Text style={styles.eventTitle} numberOfLines={2}>{title}</Text>
      <Text style={styles.eventDate}>{date}</Text>
      <View style={styles.locationContainer}>
        <Ionicons name="location-outline" size={16} color={COLORS.secondary} />
        <Text style={styles.locationText} numberOfLines={1}>{location}</Text>
      </View>
    </View>
    <TouchableOpacity style={styles.showDetailButton}>
      <Text style={styles.showDetailText}>VIEW</Text>
    </TouchableOpacity>
  </View>
)

const EventSection = ({ title, events, type }) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const [activeTab, setActiveTab] = useState('upcoming')
  
  const filteredEvents = type === 'myEvents' ? 
    events.filter(event => event.status === activeTab) :
    events

  return (
    <View style={{ marginBottom: 20 }}>
      <TouchableOpacity 
        onPress={() => setIsExpanded(!isExpanded)}
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
            onPress={() => setActiveTab('upcoming')}
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
            onPress={() => setActiveTab('completed')}
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
      
      {isExpanded && filteredEvents.map((event, index) => (
        <EventCard key={index} {...event} />
      ))}
    </View>
  )
}

export default function Events() {
  const myEvents = [
    {
      title: "Designers Meetup 2024: UI/UX Trends and Best Practices",
      date: "03 October, 2024",
      location: "Innovation Hub, District 1, HCMC",
      status: "upcoming"
    },
    {
      title: "Tech Conference 2024: AI & Machine Learning",
      date: "15 October, 2024",
      location: "Saigon Exhibition Center, District 7",
      status: "upcoming"
    },
    {
      title: "Web Summit 2024: Future of Web Development",
      date: "01 September, 2024",
      location: "HCMC University of Technology",
      status: "completed"
    },
    {
      title: "Mobile Development Workshop: React Native & Flutter",
      date: "20 August, 2024",
      location: "CoderSchool Campus, District 4",
      status: "completed"
    }
  ]

  const attendedEvents = [
    {
      title: "Vietnam Web Summit 2023",
      date: "03 October, 2023",
      location: "Rex Hotel, District 1, HCMC"
    },
    {
      title: "Mobile Development Conference 2023",
      date: "15 October, 2023",
      location: "Landmark 81, Binh Thanh District"
    }
  ]

  const router = useRouter()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Events</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <EventSection title="My Events" events={myEvents} type="myEvents" />
        <EventSection title="Events attended" events={attendedEvents} type="attended" />
      </ScrollView>
    </SafeAreaView>
  )
}
