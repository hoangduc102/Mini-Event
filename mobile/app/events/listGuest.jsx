import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import styles from '../../assets/styles/listGuest.style';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '../../store/authStore';

export default function GuestList() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams();
  const { getGuestList } = useAuthStore();
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuestList = async () => {
      const result = await getGuestList(eventId);
      if (result.success) {
        // map API response to UI format
        const mapped = result.data.map((item) => ({
          id: item.appUserDTO.id,
          status: item.stateType
        }));
        setGuests(mapped);
      } else {
        console.error('Lỗi lấy danh sách khách:', result.error);
      }
      setLoading(false);
    };

    if (eventId) {
      fetchGuestList();
    }
  }, [eventId]);
  const statusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'orange';
      case 'confirmed':
        return 'green';
      case 'canceled':
        return 'red';
      default:
        return 'gray';
    }
  };

  const statusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'help-circle-outline';
      case 'confirmed':
        return 'checkmark';
      case 'canceled':
        return 'close';
      default:
        return 'alert-circle';
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Guests</Text>
      </View>

      {/* Search */}
      <Text style={styles.sectionTitle}>Add Guests from Contact List</Text>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#aaa" />
        <TextInput style={styles.searchInput} placeholder="Enter Name or Mobile Number" />
        <MaterialIcons name="contacts" size={20} color="#999" style={{ marginRight: 8 }} />
        <Ionicons name="call-outline" size={20} color="#999" />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="orange" style={{ marginTop: 50 }} />
      ) : (
        <>
          <Text style={styles.subHeading}>Guest List</Text>
          {guests.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>Chưa có khách mời nào</Text>
          ) : (
            guests.map((guest, index) => (
              <View key={index} style={styles.guestItem}>
                <View style={styles.avatar} />
                <View style={styles.guestInfo}>
                  <Text style={styles.guestName}>{guest.id}</Text>
                  <View style={styles.statusRow}>
                    <Text style={styles.statusText(statusColor(guest.status))}>{guest.status}</Text>
                    <Ionicons
                      name={statusIcon(guest.status)}
                      size={14}
                      color={statusColor(guest.status)}
                      style={{ marginLeft: 4 }}
                    />
                  </View>
                </View>
              </View>
            ))
          )}
        </>
      )}

      {/* Action Buttons */}
      <TouchableOpacity style={styles.outlineButton}>
        <Text style={styles.outlineButtonText}>Send Invitations</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.outlineButton}>
        <Text style={styles.outlineButtonText}>Edit Contributions</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Send Reminders</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

