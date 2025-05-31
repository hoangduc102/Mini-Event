import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Modal,
    Alert,
    SafeAreaView,
    Image,
    FlatList,
    ActivityIndicator,
    Platform,
  } from "react-native";
  import { useState, useEffect, useRef, useCallback } from "react";
  import { Ionicons } from "@expo/vector-icons";
  import styles from "../../assets/styles/creat.styles";
  import { useRouter } from "expo-router";
  import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
  import * as Location from "expo-location";
  import * as ImagePicker from "expo-image-picker";
  import { useAuthStore } from "../../store/authStore";
  import DateTimePicker from "@react-native-community/datetimepicker";
  import { debounce } from "lodash";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  
  export default function Create() {
    const router = useRouter();
    const { createEvent, isLoading } = useAuthStore();
    const mapRef = useRef(null);
  
    const [eventName, setEventName] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");
    const [locationDetails, setLocationDetails] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const [description, setDescription] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [enableGPS, setEnableGPS] = useState(false);
    const [limitPeople, setLimitPeople] = useState("");
    const [tag, setTag] = useState(false);
    const [region, setRegion] = useState({
      latitude: 10.762622,
      longitude: 106.660172,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState("");
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
    const [dateTimeStr, setDateTimeStr] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isMapReady, setIsMapReady] = useState(false);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [locationError, setLocationError] = useState(null);
    const lastSearchRef = useRef("");
    const [isDragging, setIsDragging] = useState(false);
    const regionChangeTimeout = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const TAGS = [
      "SPORTS",
      "EDUCATION",
      "TECHNOLOGY",
      "ENTERTAINMENT",
      "BUSINESS",
      "HEALTH",
      "MUSIC",
      "ART",
      "FOOD",
      "TRAVEL",
      "CHARITY",
    ];
  
    useEffect(() => {
      initializeMap();
    }, []);
  
    const initializeMap = async () => {
      try {
        setIsLoadingLocation(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocationError("Please allow the app to access your location");
          return;
        }
  
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          maximumAge: 10000,
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
        console.error("Error initializing map:", error);
        setLocationError("Unable to get current location");
      } finally {
        setIsLoadingLocation(false);
      }
    };
  
    const getAddressFromCoords = useCallback(
      debounce(async (latitude, longitude) => {
        try {
          setIsGeocoding(true);
          const result = await Location.reverseGeocodeAsync(
            {
              latitude,
              longitude,
            },
            {
              useGoogleMaps: true,
              language: "vi",
            }
          );
  
          if (result && result.length > 0) {
            const address = result[0];
            const addressParts = [
              address.name,
              address.street,
              address.district,
              address.city,
              address.region,
            ].filter(Boolean);
            const formattedAddress = addressParts.join(", ");
            setSelectedAddress(formattedAddress);
            setLocation(formattedAddress);
            if (!isDragging) {
              setTempLocation({ latitude, longitude });
            }
          }
        } catch (error) {
          console.error("Error getting address:", error);
          setLocationError("Unable to get address information");
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
            language: "vi",
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
          console.error("Geocoding error:", error);
          setLocationError("Unable to find location");
        } finally {
          setIsGeocoding(false);
        }
      }, 500),
      [isMapReady]
    );
  
    const handleMapReady = useCallback(() => {
      setIsMapReady(true);
    }, []);
  
    const handleRegionChangeComplete = useCallback(
      (newRegion) => {
        if (regionChangeTimeout.current) {
          clearTimeout(regionChangeTimeout.current);
        }
  
        regionChangeTimeout.current = setTimeout(() => {
          setRegion(newRegion);
          if (!isDragging) {
            getAddressFromCoords(newRegion.latitude, newRegion.longitude);
          }
        }, 150);
      },
      [isDragging, getAddressFromCoords]
    );
  
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
        if (status !== "granted") {
          setLocationError("Please allow the app to access your location");
          return;
        }
  
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          maximumAge: 10000,
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
        console.error("Error getting current location:", error);
        setLocationError("Unable to get current location");
      } finally {
        setIsLoadingLocation(false);
      }
    };
  
    const pickImage = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow the app to access your photo library"
        );
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
      return combinedDate.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
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
        <Text style={styles.label}>Select Date and Time</Text>
        <View style={styles.dateTimeContainer}>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={24} style={styles.dateIcon} />
            <Text style={styles.dateText}>
              {dateTimeStr || "Select Date and Time"}
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
  
    const resetForm = () => {
      setEventName("");
      setDate("");
      setLocation("");
      setLocationDetails(null);
      setDescription("");
      setIsPrivate(false);
      setEnableGPS(false);
      setLimitPeople("");
      setTag(false);
      setSelectedImage(null);
      setSelectedTags([]);
      setSelectedDate(new Date());
      setSelectedTime(new Date());
      setDateTimeStr("");
      setSearchQuery("");
      setSelectedAddress("");
      setTempLocation(null);
    };
  
    const handleSaveEvent = async () => {
      try {
        if (
          !eventName ||
          !dateTimeStr ||
          !locationDetails ||
          !description ||
          selectedTags.length === 0 ||
          !limitPeople
        ) {
          Alert.alert("Error", "Please fill in all required information");
          return;
        }
  
        const limit = parseInt(limitPeople);
        if (isNaN(limit) || limit <= 0) {
          Alert.alert("Error", "Number of participants must be greater than 0");
          return;
        }
  
        const combinedDate = new Date(selectedDate);
        combinedDate.setHours(selectedTime.getHours());
        combinedDate.setMinutes(selectedTime.getMinutes());
  
        if (combinedDate < new Date()) {
          Alert.alert("Error", "Event time must be greater than current time");
          return;
        }
  
        if (eventName.length > 100) {
          Alert.alert("Error", "Event name cannot exceed 100 characters");
          return;
        }
  
        if (description.length > 1000) {
          Alert.alert("Error", "Event description cannot exceed 1000 characters");
          return;
        }
  
        if (location.length > 200) {
          Alert.alert("Error", "Address cannot exceed 200 characters");
          return;
        }
  
        setIsSubmitting(true);
  
        const eventData = {
          name: eventName.trim(),
          address: location.trim(),
          location: locationDetails
            ? {
                latitude: locationDetails.latitude,
                longitude: locationDetails.longitude,
              }
            : null,
          gps: enableGPS,
          date: combinedDate.toISOString(),
          description: description.trim(),
          eventTag: selectedTags[0],
          limit: limit,
          privateEvent: isPrivate,
        };
  
        const formData = new FormData();
        formData.append("event", {
          string: JSON.stringify(eventData),
          type: "application/json",
        });
  
        if (selectedImage) {
          let imageUri = selectedImage;
          if (Platform.OS === "ios" && selectedImage.startsWith("file://")) {
            imageUri = selectedImage.replace("file://", "");
          }
  
          const imageFile = {
            uri: imageUri,
            type: "image/jpeg",
            name: "image.jpg",
          };
          formData.append("image", imageFile);
        }
  
        console.log("FormData parts:", formData._parts);
        const result = await createEvent(null, formData);
  
        if (result.success) {
          Alert.alert("Success", "Event has been created successfully", [
            { 
              text: "OK", 
              onPress: () => {
                resetForm();
                router.replace("/events");
              }
            },
          ]);
        } else {
          Alert.alert("Error", result.error || "Failed to create event");
        }
      } catch (error) {
        console.error("Error creating event:", error);
        Alert.alert(
          "Error",
          error.message || "Unable to create event. Please try again later."
        );
      } finally {
        setIsSubmitting(false);
      }
    };
  
    const renderTagItem = ({ item }) => (
      <TouchableOpacity
        style={[
          styles.tagItem,
          tempSelectedTags.includes(item) && styles.selectedTag,
        ]}
        onPress={() => handleTagSelect(item)}
      >
        <Ionicons
          name={
            tempSelectedTags.includes(item)
              ? "radio-button-on"
              : "radio-button-off"
          }
          size={24}
          color="#4A90E2"
        />
        <Text style={styles.tagItemText}>{item}</Text>
      </TouchableOpacity>
    );
  
    const formatDate = (date) => {
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
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
              <Text style={styles.mapTitle}>Select Location</Text>
              <View style={{ width: 40 }} />
            </View>
          </SafeAreaView>
  
          <View style={styles.mapSearchContainer}>
            <View style={styles.searchInputContainer}>
              <Ionicons
                name="search"
                size={20}
                color="#666"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.mapSearchInput}
                placeholder="Search for location"
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  setLocationError(null);
                  // handleLocationSearch(text);
                }}
                onEndEditing={() => handleLocationSearch(searchQuery)}
                editable={!isGeocoding}
              />
              {isGeocoding && (
                <ActivityIndicator
                  size="small"
                  color="#4299E1"
                  style={styles.searchLoader}
                />
              )}
            </View>
            {locationError && (
              <Text style={styles.errorText}>{locationError}</Text>
            )}
          </View>
  
          {isLoadingLocation ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4299E1" />
              <Text style={styles.loadingText}>Loading map...</Text>
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
                  isLoadingLocation && styles.buttonDisabled,
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
                  !tempLocation && styles.confirmLocationButtonDisabled,
                ]}
                onPress={handleConfirmLocation}
                disabled={!tempLocation}
              >
                <Text style={styles.confirmLocationText}>
                  {tempLocation ? "Confirm Location" : "Please select location"}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>
    );
  
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={[styles.header, { 
          justifyContent: 'center',
          backgroundColor: '#fff',
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        }]}>
          <Text style={styles.headerTitle}>Create New Event</Text>
        </View>
  
        <ScrollView style={styles.container}>
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
                <Ionicons
                  name="location-outline"
                  size={24}
                  style={styles.locationIcon}
                />
                <Text
                  style={[
                    styles.locationText,
                    !location && styles.locationPlaceholder,
                  ]}
                >
                  {location || "Select event location"}
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
                  {isPrivate && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
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
                  {enableGPS && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
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
                  <Text style={styles.addTagText}>Add tag</Text>
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
                    <Image
                      source={{ uri: selectedImage }}
                      style={{ width: 100, height: 100, borderRadius: 8 }}
                    />
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
                disabled={isSubmitting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  (isLoading || isSubmitting) && { opacity: 0.7 },
                ]}
                onPress={handleSaveEvent}
                disabled={isLoading || isSubmitting}
              >
                {isLoading || isSubmitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
  
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
                <Text style={styles.tagModalTitle}>Select Category</Text>
                <TouchableOpacity onPress={handleCloseTagModal}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
  
              <View style={styles.tagListContainer}>
                <FlatList
                  data={TAGS}
                  renderItem={renderTagItem}
                  keyExtractor={(item) => item}
                  style={styles.tagList}
                />
              </View>
  
              <View style={styles.tagModalFooter}>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleConfirmTags}
                >
                  <Text style={styles.confirmButtonText}>
                    Confirm{" "}
                    {tempSelectedTags.length > 0
                      ? `(${tempSelectedTags[0]})`
                      : ""}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
  