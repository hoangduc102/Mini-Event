import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, Alert, SafeAreaView, Image } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../assets/styles/creat.styles';
import { useRouter } from 'expo-router'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

import axios from 'axios';

export default function Create() {
  const router = useRouter()
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

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setTempLocation({
      latitude,
      longitude,
    });
  };

  const handleConfirmLocation = () => {
    if (tempLocation) {
      setLocationDetails(tempLocation);
      setLocation(`${tempLocation.latitude.toFixed(6)}, ${tempLocation.longitude.toFixed(6)}`);
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

  const handleSaveEvent = async () => {
    try {
      if (!eventName || !date || !selectedLocation || !description) {
        Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin bắt buộc');
        return;
      }

      const formData = new FormData();
      formData.append('eventTag', tag ? "SPORTS" : "GENERAL");
      formData.append('gps', enableGPS);
      formData.append('name', eventName);
      formData.append('date', JSON.stringify({
        seconds: Math.floor(new Date(date).getTime() / 1000),
        nanos: 0
      }));
      formData.append('address', selectedAddress);
      formData.append('location', JSON.stringify({
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude
      }));
      formData.append('privateEvent', isPrivate);
      formData.append('limit', parseInt(limitPeople) || 0);
      formData.append('description', description);

      if (selectedImage) {
        const imageUri = selectedImage;
        const filename = imageUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image';
        
        formData.append('image', {
          uri: imageUri,
          name: filename,
          type
        });
      }

      const response = await axios.post('/v1/events', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        Alert.alert('Thành công', 'Sự kiện đã được tạo thành công');
        router.back();
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tạo sự kiện. Vui lòng thử lại sau.');
      console.error(error);
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
          <TextInput
            style={styles.input}
            placeholder="Select Date"
            value={date}
            onChangeText={setDate}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location</Text>
          <TouchableOpacity 
            style={styles.input}
            onPress={() => setShowMap(true)}
          >
            <Text>{location || 'Chọn vị trí'}</Text>
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
          <Text style={styles.label}>Tag</Text>
          <View style={styles.checkboxContainer}>
            <TouchableOpacity 
              style={[styles.checkbox, tag && styles.checkboxChecked]}
              onPress={() => setTag(!tag)}
            >
              {tag && <Ionicons name="checkmark" size={16} color="white" />}
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>Tag</Text>
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
              <Image source={{ uri: selectedImage }} style={{ width: 100, height: 100, borderRadius: 8 }} />
            ) : (
              <>
                <Text style={styles.chooseText}>Choose</Text>
                <Text style={styles.typeText}>Type to choose</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveEvent}>
            <Text style={styles.saveButtonText}>Save Details</Text>
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
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.mapTitle}>Location</Text>
              <TouchableOpacity onPress={handleConfirmLocation}>
                <Text style={styles.saveButtonText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
          <TextInput
            style={[styles.input, { margin: 16 }]}
            placeholder="Nhập tên địa điểm hoặc địa chỉ cụ thể"
            value={location}
            onChangeText={setLocation}
            onEndEditing={handleLocationInputEnd}
            editable={!isGeocoding}
          />
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={{ flex: 1, minHeight: 300 }}
            region={region}
            onRegionChangeComplete={setRegion}
            onPress={handleMapPress}
            showsUserLocation={true}
            showsMyLocationButton={true}
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
        </View>
      </Modal>
    </ScrollView>
  );
}

