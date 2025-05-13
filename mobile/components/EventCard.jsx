import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

const EventCard = ({ event }) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7}>
      <Image
        source={{ uri: event.image }}
        style={styles.image}
      />
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {event.title}
        </Text>
        <View style={styles.detailsContainer}>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={14} color="#666" />
            <Text style={styles.date}>{event.date}</Text>
          </View>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={14} color="#666" />
            <Text style={styles.location}>{event.location}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>JOIN NOW</Text>
      </TouchableOpacity>
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
  }
});

export default EventCard; 