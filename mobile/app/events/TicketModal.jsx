import React from 'react';
import { Modal, View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../assets/styles/event.styles';

export default function TicketModal({ visible, onClose, eventDetail, user, qrImage  }) {
  if (!eventDetail || !user) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.ticketModalOverlay}>
        <View style={styles.ticketModalContainer}>
          <TouchableOpacity style={styles.ticketDownloadButton}>
            <Ionicons name="download-outline" size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.ticketFavoriteButton}>
            <Ionicons name="heart" size={24} color="#A52A2A" />
          </TouchableOpacity>


          {/* <View style={styles.ticketImagePlaceholder} /> */}
          {/* Hiển thị mã QR thay vì placeholder */}
          {qrImage ? (
            <Image
              source={{ uri: qrImage }}
              style={{ width: 180, height: 180, alignSelf: 'center', marginVertical: 16 }}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.ticketImagePlaceholder} />
          )}


          <Text style={styles.ticketTitle}>{eventDetail.name}</Text>
          <Text style={styles.ticketSubtitle}>
            {eventDetail.date} ~ {eventDetail.address}
          </Text>
          <View style={styles.ticketInfoRow}>
            <View>
              <Text style={styles.ticketLabel}>Name</Text>
              <Text style={styles.ticketValue}>{user.name}</Text>
            </View>
            <View>
              <Text style={styles.ticketLabel}>Phone Number</Text>
              <Text style={styles.ticketValue}>{user.phone}</Text>
            </View>
          </View>
          <View style={styles.ticketInfoRow}>
            <View>
              <Text style={styles.ticketLabel}>Date</Text>
              <Text style={styles.ticketValue}>{eventDetail.date}</Text>
            </View>
            <View>
              <Text style={styles.ticketLabel}>Time</Text>
              <Text style={styles.ticketValue}>{eventDetail.time || '9:00 PM'}</Text>
            </View>
          </View>
          <Text style={styles.ticketNote}>Scan your barcode at the entry gate.</Text>
          <View style={styles.ticketButtonRow}>
            <TouchableOpacity style={styles.ticketActionButton} onPress={onClose}>
              <Text>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ticketActionButton}>
              <Ionicons name="location-outline" size={18} />
              <Text> GPS Check</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
} 