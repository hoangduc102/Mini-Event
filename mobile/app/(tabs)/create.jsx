import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../assets/styles/creat.styles';
import { useRouter } from 'expo-router'


export default function Create() {
  const router = useRouter()
  
  const [eventName, setEventName] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [enableGPS, setEnableGPS] = useState(false);
  const [limitPeople, setLimitPeople] = useState('');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} >
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create New Event</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Event Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter event name"
            value={eventName}
            onChangeText={setEventName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Select Date</Text>
          <TextInput
            style={styles.input}
            placeholder="Select Date"
            value={date}
            onChangeText={setDate}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter location"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter event description"
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Event Type</Text>
          <View style={styles.checkboxContainer}>
            <TouchableOpacity 
              style={[styles.checkbox, isPrivate && styles.checkboxChecked]}
              onPress={() => setIsPrivate(!isPrivate)}
            />
            <Text style={styles.checkboxLabel}>Private Event</Text>
          </View>
          
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Enable Checkin GPS</Text>
          <View style={styles.checkboxContainer}>
            <TouchableOpacity 
              style={[styles.checkbox, enableGPS && styles.checkboxChecked]}
              onPress={() => setEnableGPS(!enableGPS)}
            />
            <Text style={styles.checkboxLabel}>Yes</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Limit People</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter a number"
            value={limitPeople}
            onChangeText={setLimitPeople}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Image</Text>
          <TouchableOpacity style={styles.imageUpload}>
            <Text style={styles.chooseText}>Choose</Text>
            <Text style={styles.typeText}>Type to choose</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

