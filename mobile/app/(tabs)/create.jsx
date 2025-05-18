import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, Alert, SafeAreaView, Image, FlatList, ActivityIndicator, Platform } from 'react-native';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../assets/styles/creat.styles';
import { useRouter } from 'expo-router'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../../store/authStore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { debounce } from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Create() {
  const router = useRouter()
  const { createEvent, isLoading } = useAuthStore();
  const mapRef = useRef(null);
  
  const [eventName, setEventName] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [locationDetails, setLocationDetails] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [enableGPS, setEnableGPS] = useState(false);
  const [limitPeople, setLimitPeople] = useState('');
  const [tag, setTag] = useState(false);
  const [region, setRegion] = useState({
    latitude: 10.762622,
    longitude: 106.660172,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [tempLocation, setTempLocation] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showTagModal, setShowTagModal] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tempSelectedTags, setTempSelectedTags] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [dateTimeStr, setDateTimeStr] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMapReady, setIsMapReady] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const lastSearchRef = useRef('');
  const [isDragging, setIsDragging] = useState(false);
  const regionChangeTimeout = useRef(null);

  const TAGS = [
    'SPORTS',
    'EDUCATION',
    'TECHNOLOGY',
    'ENTERTAINMENT',
    'BUSINESS',
    'HEALTH',
    'MUSIC',
    'ART',
    'FOOD',
    'TRAVEL',
    'CHARITY'
  ];

  useEffect(() => {
    initializeMap();
  }, []);

  const initializeMap = async () => {
    try {
      setIsLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Vui lòng cho phép ứng dụng truy cập vị trí của bạn');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        maximumAge: 10000
      });

      if (location) {
        const { latitude, longitude } = location.coords;
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        getAddressFromCoords(latitude, longitude);
      }
    } catch (error) {
      console.error('Error initializing map:', error);
      setLocationError('Không thể lấy vị trí hiện tại');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const getAddressFromCoords = useCallback(
    debounce(async (latitude, longitude) => {
      try {
        setIsGeocoding(true);
        const result = await Location.reverseGeocodeAsync({
          latitude,
          longitude
        }, {
          useGoogleMaps: true,
          language: 'vi'
        });
        
        if (result && result.length > 0) {
          const address = result[0];
          const addressParts = [
            address.name,
            address.street,
            address.district,
            address.city,
            address.region,
          ].filter(Boolean);
          const formattedAddress = addressParts.join(', ');
          setSelectedAddress(formattedAddress);
          setLocation(formattedAddress);
          if (!isDragging) {
            setTempLocation({ latitude, longitude });
          }
        }
      } catch (error) {
        console.error('Error getting address:', error);
        setLocationError('Không thể lấy thông tin địa chỉ');
      } finally {
        setIsGeocoding(false);
      }
    }, 500),
    [isDragging]
  );

  const handleLocationSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim() || query === lastSearchRef.current) return;
      
      try {
        setIsGeocoding(true);
        lastSearchRef.current = query;

        const results = await Location.geocodeAsync(query, {
          useGoogleMaps: true,
          language: 'vi'
        });

        if (results && results.length > 0) {
          const { latitude, longitude } = results[0];
          const newRegion = {
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          
          setRegion(newRegion);
          if (mapRef.current && isMapReady) {
            mapRef.current.animateToRegion(newRegion, 500);
          }
          
          getAddressFromCoords(latitude, longitude);
        }
      } catch (error) {
        console.error('Geocoding error:', error);
        setLocationError('Không thể tìm thấy địa điểm');
      } finally {
        setIsGeocoding(false);
      }
    }, 500),
    [isMapReady]
  );

  const handleMapReady = useCallback(() => {
    setIsMapReady(true);
  }, []);

  const handleRegionChangeComplete = useCallback((newRegion) => {
    if (regionChangeTimeout.current) {
      clearTimeout(regionChangeTimeout.current);
    }

    regionChangeTimeout.current = setTimeout(() => {
      setRegion(newRegion);
      if (!isDragging) {
        getAddressFromCoords(newRegion.latitude, newRegion.longitude);
      }
    }, 150);
  }, [isDragging, getAddressFromCoords]);

  const handleRegionChange = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleRegionChangeEnd = useCallback(() => {
    setIsDragging(false);
    if (region) {
      getAddressFromCoords(region.latitude, region.longitude);
    }
  }, [region]);

  const handleMapPress = useCallback((e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setTempLocation({ latitude, longitude });
    getAddressFromCoords(latitude, longitude);
  }, []);

  const handleConfirmLocation = () => {
    if (tempLocation) {
      setLocationDetails(tempLocation);
      setShowMap(false);
    }
  };

  const handleGetCurrentLocation = async () => {
    try {
      setIsLoadingLocation(true);
      setLocationError(null);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Vui lòng cho phép ứng dụng truy cập vị trí của bạn');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        maximumAge: 10000
      });

      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setRegion(newRegion);
      if (mapRef.current && isMapReady) {
        mapRef.current.animateToRegion(newRegion, 500);
      }
      
      getAddressFromCoords(location.coords.latitude, location.coords.longitude);
    } catch (error) {
      console.error('Error getting current location:', error);
      setLocationError('Không thể lấy vị trí hiện tại');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Cần quyền truy cập', 'Vui lòng cho phép ứng dụng truy cập vào thư viện ảnh');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleTagSelect = (tag) => {
    if (tempSelectedTags.includes(tag)) {
      setTempSelectedTags([]);
    } else {
      setTempSelectedTags([tag]);
    }
  };

  const handleConfirmTags = () => {
    setSelectedTags([...tempSelectedTags]);
    setShowTagModal(false);
  };

  const handleCloseTagModal = () => {
    setTempSelectedTags([...selectedTags]);
    setShowTagModal(false);
  };

  const removeTag = () => {
    setSelectedTags([]);
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const formatDateTime = (date, time) => {
    const combinedDate = new Date(date);
    combinedDate.setHours(time.getHours());
    combinedDate.setMinutes(time.getMinutes());
    return combinedDate.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const onDateChange = (event, selected) => {
    setShowDatePicker(false);
    if (selected) {
      setSelectedDate(selected);
      setDateTimeStr(formatDateTime(selected, selectedTime));
    }
  };

  const onTimeChange = (event, selected) => {
    setShowTimePicker(false);
    if (selected) {
      setSelectedTime(selected);
      setDateTimeStr(formatDateTime(selectedDate, selected));
    }
  };

  const renderDateTimePicker = () => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Chọn ngày và giờ</Text>
      <View style={styles.dateTimeContainer}>
        <TouchableOpacity 
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons name="calendar-outline" size={24} style={styles.dateIcon} />
          <Text style={styles.dateText}>
            {dateTimeStr || 'Chọn ngày và giờ'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.timePickerButton}
          onPress={() => setShowTimePicker(true)}
        >
          <Ionicons name="time-outline" size={24} style={styles.timeIcon} />
        </TouchableOpacity>
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}
    </View>
  );

  const handleSaveEvent = async () => {
    try {
      // Kiểm tra dữ liệu đầu vào
      if (!eventName || !dateTimeStr || !locationDetails || !description || selectedTags.length === 0 || !limitPeople) {
        Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin bắt buộc');
        return;
      }

      // Tạo datetime từ selectedDate và selectedTime
      const combinedDate = new Date(selectedDate);
      combinedDate.setHours(selectedTime.getHours());
      combinedDate.setMinutes(selectedTime.getMinutes());

      // Chuẩn bị dữ liệu sự kiện
      const eventData = {
        name: eventName,
        location: {
          latitude: locationDetails.latitude,
          longitude: locationDetails.longitude
        },
        description: description,
        date: combinedDate.toISOString(),
        privateEvent: isPrivate,
        gps: enableGPS,
        limit: parseInt(limitPeople),
        eventTag: selectedTags[0],
        address: location
      };

      let result;
      // Tạo FormData cho mọi trường hợp
      const formData = new FormData();
      
      // Thêm dữ liệu event dưới dạng string
      formData.append('event', JSON.stringify(eventData));

      if (selectedImage) {
        // Xử lý đường dẫn hình ảnh
        let imageUri = selectedImage;
        if (Platform.OS === 'ios' && selectedImage.startsWith('file://')) {
          imageUri = selectedImage.replace('file://', '');
        }
        
        // Thêm file hình ảnh
        const imageFile = {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'image.jpg'
        };
        formData.append('image', imageFile);
      }

      console.log('FormData parts:', formData._parts);
      result = await createEvent(null, formData);
      
      if (result.success) {
        Alert.alert(
          'Thành công',
          'Sự kiện đã được tạo thành công',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        Alert.alert('Lỗi', result.error || 'Tạo sự kiện thất bại');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      Alert.alert('Lỗi', error.message || 'Không thể tạo sự kiện. Vui lòng thử lại sau.');
    }
  };

  const renderTagItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.tagItem,
        tempSelectedTags.includes(item) && styles.selectedTag
      ]}
      onPress={() => handleTagSelect(item)}
    >
      <Ionicons
        name={tempSelectedTags.includes(item) ? "radio-button-on" : "radio-button-off"}
        size={24}
        color="#4A90E2"
      />
      <Text style={styles.tagItemText}>{item}</Text>
    </TouchableOpacity>
  );

  const formatDate = (date) => {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderMapModal = () => (
    <Modal
      visible={showMap}
      animationType="slide"
      onRequestClose={() => setShowMap(false)}
    >
      <View style={styles.mapContainer}>
        <SafeAreaView>
          <View style={styles.mapHeader}>
            <TouchableOpacity 
              style={styles.mapHeaderButton} 
              onPress={() => setShowMap(false)}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.mapTitle}>Chọn địa điểm</Text>
            <View style={{ width: 40 }} />
          </View>
        </SafeAreaView>

        <View style={styles.mapSearchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.mapSearchInput}
              placeholder="Tìm kiếm địa điểm"
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                setLocationError(null);
                handleLocationSearch(text);
              }}
              editable={!isGeocoding}
            />
            {isGeocoding && (
              <ActivityIndicator size="small" color="#4299E1" style={styles.searchLoader} />
            )}
          </View>
          {locationError && (
            <Text style={styles.errorText}>{locationError}</Text>
          )}
        </View>

        {isLoadingLocation ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4299E1" />
            <Text style={styles.loadingText}>Đang tải bản đồ...</Text>
          </View>
        ) : (
          <>
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              region={region}
              onRegionChangeComplete={handleRegionChangeComplete}
              onRegionChange={handleRegionChange}
              onPanDrag={() => setIsDragging(true)}
              onTouchEnd={handleRegionChangeEnd}
              onPress={handleMapPress}
              onMapReady={handleMapReady}
              showsUserLocation
              showsMyLocationButton={false}
              loadingEnabled
              loadingIndicatorColor="#4299E1"
              loadingBackgroundColor="#fff"
              minZoomLevel={5}
              maxZoomLevel={20}
            />

            <View style={styles.markerFixed}>
              <Ionicons name="location" size={40} color="#4299E1" />
            </View>

            <TouchableOpacity 
              style={[
                styles.currentLocationButton,
                isLoadingLocation && styles.buttonDisabled
              ]}
              onPress={handleGetCurrentLocation}
              disabled={isLoadingLocation}
            >
              {isLoadingLocation ? (
                <ActivityIndicator size="small" color="#4299E1" />
              ) : (
                <Ionicons name="navigate" size={24} color="#4299E1" />
              )}
            </TouchableOpacity>

            {selectedAddress && (
              <View style={styles.selectedLocationContainer}>
                <Text style={styles.selectedLocationText}>
                  {selectedAddress}
                </Text>
              </View>
            )}

            <TouchableOpacity 
              style={[
                styles.confirmLocationButton,
                !tempLocation && styles.confirmLocationButtonDisabled
              ]}
              onPress={handleConfirmLocation}
              disabled={!tempLocation}
            >
              <Text style={styles.confirmLocationText}>
                {tempLocation ? 'Xác nhận vị trí' : 'Vui lòng chọn vị trí'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </Modal>
  );

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

        {renderDateTimePicker()}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location</Text>
          <TouchableOpacity 
            style={styles.locationInput}
            onPress={() => setShowMap(true)}
          >
            <Ionicons name="location-outline" size={24} style={styles.locationIcon} />
            <Text style={[styles.locationText, !location && styles.locationPlaceholder]}>
              {location || 'Chọn vị trí sự kiện'}
            </Text>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>
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
            >
              {isPrivate && <Ionicons name="checkmark" size={16} color="white" />}
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>Private Event</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Enable Checkin GPS</Text>
          <View style={styles.checkboxContainer}>
            <TouchableOpacity 
              style={[styles.checkbox, enableGPS && styles.checkboxChecked]}
              onPress={() => setEnableGPS(!enableGPS)}
            >
              {enableGPS && <Ionicons name="checkmark" size={16} color="white" />}
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>Yes</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tags</Text>
          <View style={styles.selectedTagsContainer}>
            {selectedTags.map((tag) => (
              <View key={tag} style={styles.tagChip}>
                <Text style={styles.tagChipText}>{tag}</Text>
                <TouchableOpacity
                  style={styles.removeTagButton}
                  onPress={() => removeTag(tag)}
                >
                  <Ionicons name="close-circle" size={18} color="#4A90E2" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={styles.addTagButton}
              onPress={() => setShowTagModal(true)}
            >
              <Ionicons name="add" size={18} color="#4A90E2" />
              <Text style={styles.addTagText}>Thêm tag</Text>
            </TouchableOpacity>
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
          <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
            {selectedImage ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: selectedImage }} style={{ width: 100, height: 100, borderRadius: 8 }} />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={removeImage}
                >
                  <Ionicons name="close-circle" size={24} color="#4A90E2" />
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={styles.chooseText}>Choose</Text>
                <Text style={styles.typeText}>Type to choose</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Hủy</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.saveButton, isLoading && { opacity: 0.7 }]}
            onPress={handleSaveEvent}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Lưu</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {renderMapModal()}

      <Modal
        visible={showTagModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseTagModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.tagModalContent}>
            <View style={styles.tagModalHeader}>
              <Text style={styles.tagModalTitle}>Chọn thể loại</Text>
              <TouchableOpacity onPress={handleCloseTagModal}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.tagListContainer}>
              <FlatList
                data={TAGS}
                renderItem={renderTagItem}
                keyExtractor={item => item}
                style={styles.tagList}
              />
            </View>

            <View style={styles.tagModalFooter}>
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={handleConfirmTags}
              >
                <Text style={styles.confirmButtonText}>
                  Xác nhận {tempSelectedTags.length > 0 ? `(${tempSelectedTags[0]})` : ''}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

