import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, Alert, SafeAreaView, Image, FlatList, ActivityIndicator, Platform } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../assets/styles/creat.styles';
import { useRouter } from 'expo-router'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../../store/authStore';
import DateTimePicker from '@react-native-community/datetimepicker';

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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

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
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  useEffect(() => {
    if (showTagModal) {
      setTempSelectedTags([...selectedTags]);
    }
  }, [showTagModal]);

  const handleLocationInputEnd = async () => {
    if (!location) return;
    setIsGeocoding(true);
    try {
      const geo = await Location.geocodeAsync(location);
      if (geo && geo.length > 0) {
        const { latitude, longitude } = geo[0];
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        setLocationDetails({ latitude, longitude });
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }, 1000);
        }
      }
    } catch (e) {
      // Có thể hiển thị thông báo lỗi nếu muốn
    }
    setIsGeocoding(false);
  };

  const getAddressFromCoords = async (latitude, longitude) => {
    try {
      const result = await Location.reverseGeocodeAsync({
        latitude,
        longitude
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
        return addressParts.join(', ');
      }
      return null;
    } catch (error) {
      console.error('Error getting address:', error);
      return null;
    }
  };

  const handleMapPress = async (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setTempLocation({
      latitude,
      longitude,
    });
    
    const address = await getAddressFromCoords(latitude, longitude);
    if (address) {
      setSelectedAddress(address);
    }
  };

  const handleConfirmLocation = async () => {
    if (tempLocation) {
      setLocationDetails(tempLocation);
      if (selectedAddress) {
        setLocation(selectedAddress);
      } else {
        const address = await getAddressFromCoords(tempLocation.latitude, tempLocation.longitude);
        if (address) {
          setLocation(address);
        } else {
          setLocation(`${tempLocation.latitude.toFixed(6)}, ${tempLocation.longitude.toFixed(6)}`);
        }
      }
      setShowMap(false);
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

  const handleSaveEvent = async () => {
    try {
      // Kiểm tra dữ liệu đầu vào
      if (!eventName || !date || !locationDetails || !description || selectedTags.length === 0) {
        Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin bắt buộc');
        return;
      }

      // Xử lý date
      const dateObj = new Date(date.split('/').reverse().join('-'));
      if (isNaN(dateObj.getTime())) {
        Alert.alert('Lỗi', 'Ngày không hợp lệ');
        return;
      }

      // Chuẩn bị dữ liệu sự kiện
      const eventDataObj = {
        eventTag: selectedTags[0],
        gps: enableGPS,
        name: eventName,
        date: {
          seconds: Math.floor(dateObj.getTime() / 1000),
          nanos: 0
        },
        address: location,
        location: {
          latitude: locationDetails.latitude,
          longitude: locationDetails.longitude
        },
        privateEvent: isPrivate,
        limit: parseInt(limitPeople) || 0,
        description: description
      };

      console.log('Event data being sent:', eventDataObj);

      if (selectedImage) {
        try {
          console.log('Selected image:', selectedImage);
          
          // Tạo FormData
          const formData = new FormData();
          
          // Thêm event data
          formData.append('event', JSON.stringify(eventDataObj));
          
          // Xử lý đường dẫn hình ảnh
          let imageUri = selectedImage;
          if (Platform.OS === 'ios' && selectedImage.startsWith('file://')) {
            imageUri = selectedImage.replace('file://', '');
          }
          
          // Thêm file hình ảnh
          const filename = imageUri.split('/').pop();
          const match = /\.(\w+)$/.exec(filename);
          const extension = match ? match[1].toLowerCase() : 'jpg';
          
          // Chuyển đổi extension thành MIME type
          let mimeType;
          switch (extension) {
            case 'jpg':
            case 'jpeg':
              mimeType = 'image/jpeg';
              break;
            case 'png':
              mimeType = 'image/png';
              break;
            case 'gif':
              mimeType = 'image/gif';
              break;
            default:
              mimeType = 'image/jpeg';
          }
          
          // Tạo file object
          const imageFile = {
            uri: imageUri,
            type: mimeType,
            name: `image.${extension}`
          };
          
          console.log('Image file:', imageFile);
          formData.append('image', imageFile);

          console.log('FormData being sent:', formData);

          // Gọi API với FormData
          const result = await createEvent(null, formData);
          console.log('API response:', result);

          if (result.success) {
            Alert.alert(
              'Thành công',
              'Sự kiện đã được tạo thành công',
              [{ text: 'OK', onPress: () => router.back() }]
            );
          } else {
            if (result.error === 'Network request failed') {
              Alert.alert(
                'Lỗi kết nối',
                'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng và thử lại.',
                [{ text: 'OK' }]
              );
            } else {
              console.error('Error details:', result.error);
              Alert.alert('Lỗi', result.error || 'Tạo sự kiện thất bại');
            }
          }
        } catch (error) {
          console.error('Error processing image:', error);
          Alert.alert('Lỗi', 'Không thể xử lý hình ảnh. Vui lòng thử lại.');
        }
      } else {
        console.log('Sending event without image');
        // Gọi API không có hình ảnh
        const result = await createEvent(eventDataObj);
        console.log('API response:', result);

        if (result.success) {
          Alert.alert(
            'Thành công',
            'Sự kiện đã được tạo thành công',
            [{ text: 'OK', onPress: () => router.back() }]
          );
        } else {
          if (result.error === 'Network request failed') {
            Alert.alert(
              'Lỗi kết nối',
              'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng và thử lại.',
              [{ text: 'OK' }]
            );
          } else {
            console.error('Error details:', result.error);
            Alert.alert('Lỗi', result.error || 'Tạo sự kiện thất bại');
          }
        }
      }
    } catch (error) {
      console.error('Full error details:', error);
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

  const onDateChange = (event, selected) => {
    setShowDatePicker(false);
    if (selected) {
      setSelectedDate(selected);
      setDate(formatDate(selected));
    }
  };

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
          <TouchableOpacity 
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={24} style={styles.dateIcon} />
            <Text style={styles.dateText}>
              {date || 'Chọn ngày'}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>

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

      <Modal
        visible={showMap}
        animationType="slide"
        onRequestClose={() => setShowMap(false)}
      >
        <View style={styles.mapContainer}>
          <SafeAreaView>
            <View style={styles.mapHeader}>
              <TouchableOpacity onPress={() => setShowMap(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.mapTitle}>Chọn địa điểm</Text>
              <View style={{width: 24}} />
            </View>
          </SafeAreaView>

          <View style={styles.mapSearchContainer}>
            <TextInput
              style={styles.mapSearchInput}
              placeholder="Tìm kiếm địa điểm"
              value={location}
              onChangeText={setLocation}
              onEndEditing={handleLocationInputEnd}
              editable={!isGeocoding}
            />
          </View>

          <View style={styles.markerFixed}>
            <Ionicons name="location" size={48} color="#4A90E2" />
          </View>

          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={{ flex: 1 }}
            region={region}
            onRegionChangeComplete={setRegion}
            onPress={handleMapPress}
            showsUserLocation={true}
          >
            {tempLocation && (
              <Marker
                coordinate={{
                  latitude: tempLocation.latitude,
                  longitude: tempLocation.longitude,
                }}
              />
            )}
          </MapView>

          <TouchableOpacity 
            style={styles.currentLocationButton}
            onPress={async () => {
              let { status } = await Location.requestForegroundPermissionsAsync();
              if (status !== 'granted') {
                Alert.alert('Permission denied', 'Please allow location access to use this feature');
                return;
              }
              let location = await Location.getCurrentPositionAsync({});
              const newRegion = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              };
              setRegion(newRegion);
              mapRef.current?.animateToRegion(newRegion, 1000);
            }}
          >
            <Ionicons name="navigate" size={24} color="#4A90E2" />
          </TouchableOpacity>

          {tempLocation && (
            <View style={styles.selectedLocationContainer}>
              <Text style={styles.selectedLocationText}>
                {selectedAddress || 'Đang tải địa chỉ...'}
              </Text>
            </View>
          )}

          <TouchableOpacity 
            style={styles.confirmLocationButton}
            onPress={handleConfirmLocation}
          >
            <Text style={styles.confirmLocationText}>Xác nhận vị trí</Text>
          </TouchableOpacity>
        </View>
      </Modal>

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

