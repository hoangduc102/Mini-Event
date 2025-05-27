// app/eventDetail.jsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../assets/styles/eventDetail.style'; // Điều chỉnh đường dẫn nếu cần
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Link } from 'expo-router';




export default function EventDetail() {
  const { title, date, location, status } = useLocalSearchParams();
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Event Image */}
      <View style={styles.imagePlaceholder}>
        <Text style={styles.imageText}>IMAGE</Text>
      </View>

      {/* Event Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.row}>
          <Ionicons name="location-outline" size={16} color="orange" />
          <Text style={styles.smallText}>{location}</Text>
          <Ionicons name="calendar-outline" size={16} color="orange" style={{ marginLeft: 10 }} />
          <Text style={styles.smallText}>{date}</Text>
        </View>

        {status && (
          <View style={[styles.statusBadge, status === 'upcoming' ? styles.upcomingBadge : styles.completedBadge]}>
            <Text style={styles.statusBadgeText}>{status === 'upcoming' ? 'Upcoming' : 'Completed'}</Text>
          </View>
        )}

        <View style={[styles.row, { marginTop: 8 }]}>
          <Text style={styles.smallText}>15.7k+</Text>
          <Text style={styles.smallText}> Members are joined:</Text>
          {[1, 2, 3, 4].map((i) => (
            <Image
              key={i}
              source={{ uri: `https://i.pravatar.cc/24?img=${i}` }}
              style={styles.avatar}
            />
          ))}
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
        <Text style={styles.descriptionText} numberOfLines={3}>
          Ultricies arcu venenatis in lorem faucibus lobortis at. Est odio varius nisl congue
          aliquam nunc est sit pull convallis magna. Est scelerisque dignissim non nibh...
        </Text>
        <Text style={styles.readMore}>Read More</Text>
      </View>

      {/* Button */}
      
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>GET TICKET</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
