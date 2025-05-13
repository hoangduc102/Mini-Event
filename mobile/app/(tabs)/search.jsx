import { View, ScrollView, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import EventCard from '../../components/EventCard';
import SearchInput from '../../components/SearchInput';

// Dữ liệu sự kiện mẫu
const events = [
  {
    id: 1,
    title: "Designers Meetup 2025",
    date: "03 October, 22",
    location: "Gulshan, Dhaka",
    image: "https://images.unsplash.com/photo-1530099486328-e021101a494a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1lZXR1cHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 2,
    title: "Dribblers Meetup 2022",
    date: "07 October, 22",
    location: "Banani, Dhaka",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZHJpYmJibGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 3,
    title: "Food Competition Event",
    date: "10 October, 22",
    location: "Mirpur, Dhaka",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 4,
    title: "Basketball Final Match",
    date: "10 October, 22",
    location: "Uttara, Dhaka",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 5,
    title: "ARB Stunt Riders Event",
    date: "22 October, 22",
    location: "M Badda, Dhaka",
    image: "https://images.unsplash.com/photo-1605235186583-a8272b61f9fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 6,
    title: "International Music Concert",
    date: "30 October, 22",
    location: "Gulshan, Dhaka",
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 7,
    title: "Football Final Match",
    date: "03 October, 22",
    location: "Gulshan, Dhaka",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 8,
    title: "Food Competition Event",
    date: "10 October, 22",
    location: "Mirpur, Dhaka",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
  }
];

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Events</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="filter" size={22} color="#1a1a1a" />
        </TouchableOpacity>
      </View>

      <SearchInput 
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {searchQuery ? (
          <Text style={styles.resultText}>
            {filteredEvents.length} results found
          </Text>
        ) : null}
        {filteredEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 35
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomColor: '#f5f5f5',
    borderBottomWidth: 1,
    marginTop: -20
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#f5f5f5'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a'
  },
  scrollContent: {
    paddingVertical: 8
  },
  resultText: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 16,
    marginBottom: 8
  }
});
