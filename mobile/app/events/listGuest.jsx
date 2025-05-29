import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../assets/styles/listGuest.style';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '../../store/authStore';

export default function GuestList() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams();
  const { getGuestList, searchUserByPhone, addUserToEvent, removeUserFromEvent } = useAuthStore();
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    fetchGuestList();
  }, [eventId]);

  const fetchGuestList = async () => {
    const result = await getGuestList(eventId);
    if (result.success) {
      const mapped = result.data.map((item) => ({
        id: item.appUserDTO.id,
        phone: item.appUserDTO.phone,
        status: item.stateType
      }));
      setGuests(mapped);
    } else {
      console.error('Lỗi lấy danh sách khách:', result.error);
      Alert.alert('Lỗi', 'Không thể lấy danh sách khách mời');
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    const result = await searchUserByPhone(searchQuery);
    setSearchLoading(false);

    if (result.success) {
      const processedResults = result.data.map(user => {
        const existingGuest = guests.find(guest => guest.phone === user.phone);
        return {
          ...user,
          status: existingGuest ? existingGuest.status : 'not_invited'
        };
      });
      setSearchResults(processedResults);
    } else {
      Alert.alert('Lỗi', result.error || 'Không thể tìm kiếm người dùng');
    }
  };

  const handleSelectUser = (user) => {
    if (user.status === 'not_invited') {
      if (selectedUsers.some(selected => selected.phone === user.phone)) {
        setSelectedUsers(selectedUsers.filter(selected => selected.phone !== user.phone));
      } else {
        setSelectedUsers([...selectedUsers, user]);
      }
    }
  };

  const handleSendInvitations = async () => {
    if (selectedUsers.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn ít nhất một người dùng');
      return;
    }

    setLoading(true);
    let successCount = 0;
    let failCount = 0;

    for (const user of selectedUsers) {
      const result = await addUserToEvent(eventId, user.phone);
      if (result.success) {
        successCount++;
      } else {
        failCount++;
      }
    }

    setLoading(false);
    setSelectedUsers([]);
    setSearchResults([]);
    setSearchQuery('');

    if (successCount > 0) {
      Alert.alert('Thành công', `Đã thêm ${successCount} người dùng vào sự kiện`);
      fetchGuestList();
    }
    if (failCount > 0) {
      Alert.alert('Lỗi', `Không thể thêm ${failCount} người dùng`);
    }
  };

  const handleRemoveUser = async (phone) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn xóa người dùng này khỏi sự kiện?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            const result = await removeUserFromEvent(eventId, phone);
            if (result.success) {
              Alert.alert('Thành công', 'Đã xóa người dùng khỏi sự kiện');
              fetchGuestList();
              handleSearch();
            } else {
              Alert.alert('Lỗi', result.error || 'Không thể xóa người dùng');
            }
          }
        }
      ]
    );
  };

  const statusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#FFA000';
      case 'confirmed':
        return '#4CAF50';
      case 'canceled':
        return '#F44336';
      case 'not_invited':
        return '#757575';
      default:
        return '#757575';
    }
  };

  const statusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'help-circle-outline';
      case 'confirmed':
        return 'checkmark-circle';
      case 'canceled':
        return 'close-circle';
      case 'not_invited':
        return 'person-add-outline';
      default:
        return 'alert-circle';
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="people-outline" size={48} color="#666" />
      <Text style={styles.emptyStateText}>Chưa có khách mời nào</Text>
    </View>
  );

  const renderSearchResultItem = (user) => {
    const isSelected = selectedUsers.some(selected => selected.phone === user.phone);
    const isInvited = user.status !== 'not_invited';

    return (
      <TouchableOpacity
        key={user.phone}
        style={[
          styles.guestItem,
          isSelected && styles.selectedItem,
          isInvited && styles.invitedItem
        ]}
        onPress={() => handleSelectUser(user)}
        disabled={isInvited}
      >
        <View style={styles.avatar}>
          <Ionicons name="person" size={24} color="#666" />
        </View>
        <View style={styles.guestInfo}>
          <Text style={styles.guestName}>{user.phone}</Text>
          <View style={styles.statusRow}>
            <Text style={styles.statusText(statusColor(user.status))}>
              {user.status === 'not_invited' ? 'Chưa mời' : user.status}
            </Text>
            <Ionicons
              name={statusIcon(user.status)}
              size={14}
              color={statusColor(user.status)}
              style={{ marginLeft: 4 }}
            />
          </View>
        </View>
        {isInvited ? (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveUser(user.phone)}
          >
            <Ionicons name="trash-outline" size={24} color="#F44336" />
          </TouchableOpacity>
        ) : (
          <Ionicons
            name={isSelected ? 'checkmark-circle' : 'add-circle-outline'}
            size={24}
            color={isSelected ? '#2196f3' : '#666'}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Guest List</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Search Section */}
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>Add Guest</Text>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" />
            <TextInput 
              style={styles.searchInput} 
              placeholder="Enter phone number to search" 
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              keyboardType="phone-pad"
              returnKeyType="search"
            />
            <TouchableOpacity onPress={handleSearch}>
              <Ionicons name="search" size={20} color="#2196f3" />
            </TouchableOpacity>
          </View>

          {/* Search Results */}
          {searchLoading ? (
            <ActivityIndicator size="small" color="#2196f3" style={{ marginTop: 10 }} />
          ) : searchResults.length > 0 ? (
            <View style={styles.searchResults}>
              {searchResults.map(renderSearchResultItem)}
            </View>
          ) : null}
        </View>

        {/* Guest List Section */}
        <View style={styles.guestListSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.subHeading}>Guest List</Text>
            <Text style={styles.guestCount}>{guests.length} people</Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#2196f3" style={{ marginTop: 50 }} />
          ) : guests.length === 0 ? (
            renderEmptyState()
          ) : (
            guests.map((guest, index) => (
              <View key={index} style={styles.guestItem}>
                <View style={styles.avatar}>
                  <Ionicons name="person" size={24} color="#666" />
                </View>
                <View style={styles.guestInfo}>
                  <Text style={styles.guestName}>{guest.phone}</Text>
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
                <TouchableOpacity
                  onPress={() => handleRemoveUser(guest.phone)}
                  style={styles.removeButton}
                >
                  <Ionicons name="trash-outline" size={24} color="#F44336" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomActions}>
        {selectedUsers.length > 0 ? (
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleSendInvitations}
          >
            <Text style={styles.primaryButtonText}>
              Gửi lời mời ({selectedUsers.length})
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.outlineButton}
            onPress={() => setSearchQuery('')}
          >
            <Text style={styles.outlineButtonText}>
              Thêm khách mời
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
