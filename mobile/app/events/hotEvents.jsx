import { 
    View, 
    ScrollView, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    StatusBar, 
    ActivityIndicator,
    RefreshControl,
    Alert
  } from 'react-native';
  import React, { useState, useEffect, useCallback } from 'react';
  import { Ionicons } from '@expo/vector-icons';
  import { useRouter } from 'expo-router';
  import EventCard from '../../components/EventCard';
  import SearchInput from '../../components/SearchInput';
  import { useAuthStore } from '../../store/authStore';
  
  export default function Search() {
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();
    
    const { 
      events, 
      isLoading, 
      isLoadingMore,
      hasMoreEvents,
      error,
      getEvents,
      resetEvents,
      clearError,
      token,
      user
    } = useAuthStore();
  
    // Load events lần đầu khi có token
    useEffect(() => {
      if (token && user) {
        console.log('Initial load with token:', token);
        loadEvents();
      } else {
        console.log('No token or user available');
      }
      return () => {
        resetEvents();
      };
    }, [token, user]);
  
    // Xử lý error
    useEffect(() => {
      if (error) {
        if (error.includes('đăng nhập')) {
          // Nếu là lỗi yêu cầu đăng nhập, không hiện alert
          clearError();
        } else {
          Alert.alert(
            'Lỗi',
            error,
            [{ text: 'OK', onPress: clearError }]
          );
        }
      }
    }, [error]);
  
    const loadEvents = async () => {
      console.log('Loading events...');
      if (token && user) {
        const result = await getEvents(false);
        console.log('Load events result:', result);
        console.log('Current events in state:', events.length);
      }
    };
  
    const loadMore = async () => {
      console.log('Loading more events...');
      if (!isLoadingMore && hasMoreEvents && token && user) {
        const result = await getEvents(true);
        console.log('Load more result:', result);
        console.log('Updated events in state:', events.length);
      }
    };
  
    const handleEventPress = useCallback((eventId) => {
      router.push({
        pathname: `/events/${eventId}`,
        params: { id: eventId }
      });
    }, [router]);
  
    const onRefresh = useCallback(async () => {
      if (!token || !user) {
        Alert.alert(
          'Thông báo',
          'Vui lòng đăng nhập để xem danh sách sự kiện',
          [
            { 
              text: 'Đăng nhập', 
              onPress: () => router.push('/login') 
            },
            { 
              text: 'Hủy', 
              style: 'cancel' 
            }
          ]
        );
        return;
      }
      setRefreshing(true);
      await loadEvents();
      setRefreshing(false);
    }, [token, user]);
  
    const filteredEvents = events.filter(event => {
      if (!event || typeof event !== 'object') {
        console.log('Invalid event object:', event);
        return false;
      }
      
      const searchLower = searchQuery.toLowerCase();
      
      // Tìm kiếm theo name
      const name = typeof event.name === 'string' ? event.name.toLowerCase() : '';
      
      // Tìm kiếm theo description
      const description = typeof event.description === 'string' ? event.description.toLowerCase() : '';
      
      // Tìm kiếm theo address
      const address = typeof event.address === 'string' ? event.address.toLowerCase() : '';
      
      // Tìm kiếm theo eventTag
      const eventTag = typeof event.eventTag === 'string' ? event.eventTag.toLowerCase() : '';
  
      const isMatch = name.includes(searchLower) || 
             description.includes(searchLower) || 
             address.includes(searchLower) ||
             eventTag.includes(searchLower);
             
      console.log('Event search match:', {
        event: event.name,
        searchQuery: searchLower,
        isMatch
      });
      
      return isMatch;
    });
  
    const renderFooter = () => {
      if (!isLoadingMore) return null;
      
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color="#0066cc" />
        </View>
      );
    };
  
    const renderContent = () => {
      if (!token || !user) {
        return (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Please login to see the event list
            </Text>
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={() => router.push('/login')}
              
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        );
      }
  
      if (isLoading && events.length === 0) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0066cc" />
          </View>
        );
      }
  
      if (events.length === 0) {
        return (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No public events found</Text>
          </View>
        );
      }
  
      if (searchQuery && filteredEvents.length === 0) {
        return (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Không tìm thấy sự kiện công khai nào phù hợp với từ khóa "{searchQuery}"
            </Text>
          </View>
        );
      }
  
      return (
        <>
          {searchQuery && filteredEvents.length > 0 && (
            <Text style={styles.resultText}>
              {filteredEvents.length} sự kiện công khai được tìm thấy
            </Text>
          )}
          {(searchQuery ? filteredEvents : events).map((event) => (
            <EventCard 
              key={event.id} 
              event={event}
              // onPress={() => handleEventPress(event.id)}
            />
          ))}
          {renderFooter()}
        </>
      );
    };
  
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={[styles.header, { justifyContent: 'space-between', alignItems: 'center' }]}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hot Events</Text>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="filter" size={22} color="#1a1a1a" />
          </TouchableOpacity>
        </View>
  
        <SearchInput 
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Tìm kiếm sự kiện..."
        />
        
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            (!token || !user) && styles.centerContent
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          onScroll={({ nativeEvent }) => {
            if (!token || !user) return;
            
            const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
            const isCloseToBottom = (layoutMeasurement.height + contentOffset.y) 
              >= (contentSize.height - 20);
              
            if (isCloseToBottom) {
              loadMore();
            }
          }}
          scrollEventThrottle={400}
        >
          {searchQuery && events.length > 0 ? (
            <Text style={styles.resultText}>
              {filteredEvents.length} kết quả được tìm thấy
            </Text>
          ) : null}
          
          {renderContent()}
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
      paddingVertical: 8,
      minHeight: '100%'
    },
    centerContent: {
      justifyContent: 'center'
    },
    resultText: {
      fontSize: 14,
      color: '#666',
      marginHorizontal: 16,
      marginBottom: 8
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 50
    },
    footerLoader: {
      paddingVertical: 20,
      alignItems: 'center'
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 100
    },
    emptyText: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
      marginBottom: 20
    },
    loginButton: {
      backgroundColor: '#0066cc',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8
    },
    loginButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600'
    }
  });
  