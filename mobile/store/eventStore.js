import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { encode as base64Encode } from 'base-64';

const IP_ADDRESS = process.env.EXPO_PUBLIC_IP_ADDRESS
const FIREBASE_API_KEY = process.env.EXPO_PUBLIC_FIREBASE_APIKEY


const API_BASE_URL = `${IP_ADDRESS}/v1`


// Utility function để lấy token
const getAuthToken = async () => {
  const token = await AsyncStorage.getItem('token');
  if (!token) throw new Error('Authentication required');
  return token;
};

// Tạo axios instance với config chung
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Add interceptor để tự động thêm token
api.interceptors.request.use(async (config) => {
  try {
    const token = await getAuthToken();
    console.log('Adding token to request:', token.substring(0, 10) + '...');
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  } catch (error) {
    console.error('Error getting token:', error);
    return Promise.reject(error);
  }
}, error => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// Add interceptor để xử lý response
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  async (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

// Hàm xử lý error message
const getErrorMessage = (error) => {
  if (error.response) {
    // Server trả về response với status code nằm ngoài range 2xx
    switch (error.response.status) {
      case 400:
        return 'Invalid request';
      case 401:
        return 'Session expired';
      case 403:
        return 'Access denied';
      case 404:
        return null; // Trường hợp chưa tham gia event nào
      case 500:
        return 'System error, please try again later';
      default:
        return error.response.data?.message || 'An error occurred';
    }
  } else if (error.request) {
    // Request đã được gửi nhưng không nhận được response
    return 'Cannot connect to server';
  } else {
    // Có lỗi khi setup request
    return 'An error occurred, please try again';
  }
};

// Xử lý response chung
const handleApiResponse = (response) => {
  if (!response.data) {
    throw new Error('No data received from server');
  }

  if (response.data.status !== 200) {
    throw new Error(response.data.message || 'Server error');
  }

  return response.data.data;
};

// Thêm hàm retry utility
const retryOperation = async (operation, maxRetries = 3, delay = 1000) => {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
  throw lastError;
};

export const useEventStore = create((set, get) => ({
  myEvents: [], // Events của user hiện tại
  attendedEvents: [], // Events đã tham dự
  isLoading: false,
  isLoadingAttended: false,
  error: null,
  attendedError: null, // Thêm state riêng cho lỗi attended events
  retryCount: 0, // Thêm biến đếm số lần retry

  setIsLoading: (isLoading) => set({ isLoading }),
  resetEvents: () => {
    set({
      myEvents: [],
      attendedEvents: [],
      isLoading: false,
      isLoadingAttended: false,
      error: null,
      attendedError: null,
      retryCount: 0
    });
  },

  // Lấy events của user hiện tại
  getMyEvents: async () => {
    try {
      set({ isLoading: true, error: null });
      console.log('Calling getMyEvents API...');

      const response = await retryOperation(async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        try {
          console.log('Making request to /users/events');
          const response = await api.get('/users/events', {
            signal: controller.signal,
            validateStatus: function (status) {
              return status === 200 || status === 404;
            }
          });
          console.log('Response from /users/events:', response.data);

          clearTimeout(timeoutId);
          return response;
        } catch (error) {
          clearTimeout(timeoutId);
          console.error('Error in getMyEvents request:', error);
          throw error;
        }
      });

      if (response.status === 404 ||
        (response.data && response.data.data && response.data.data.length === 0)) {
        console.log('No events found');
        set({
          myEvents: [],
          isLoading: false,
          error: null
        });
        return { success: true, data: [] };
      }

      if (!response.data || response.data.status !== 200) {
        console.error('Invalid response format:', response.data);
        throw new Error(response.data?.message || 'Failed to fetch events');
      }

      const events = response.data.data || [];
      console.log('Parsed events:', events);
      set({
        myEvents: events,
        isLoading: false,
        error: null
      });

      return { success: true, data: events };
    } catch (error) {
      console.error('Error in getMyEvents:', error);
      const errorMessage = getErrorMessage(error);
      set({
        isLoading: false,
        error: errorMessage
      });
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Lấy events đã tham dự với retry logic
  getAttendedEvents: async (isRetry = false) => {
    try {
      if (isRetry && get().retryCount >= 3) {
        throw new Error('Unable to load data after multiple attempts');
      }

      set({
        isLoadingAttended: true,
        attendedError: null,
        retryCount: isRetry ? get().retryCount + 1 : 0
      });

      console.log('Calling getAttendedEvents API...');

      const response = await retryOperation(async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        try {
          console.log('Making request to /users/events/attended');
          const response = await api.get('/users/events/attended', {
            signal: controller.signal,
            validateStatus: function (status) {
              return status === 200 || status === 404 || status === 500;
            }
          });
          console.log('Response from /users/events/attended:', response.data);

          clearTimeout(timeoutId);
          return response;
        } catch (error) {
          clearTimeout(timeoutId);
          console.error('Error in getAttendedEvents request:', error);
          throw error;
        }
      });

      // Xử lý các trường hợp response
      if (response.status === 404 ||
        (response.data && response.data.data && response.data.data.length === 0) ||
        (response.status === 500 && response.data?.message?.includes('Failed to find events'))) {
        console.log('No attended events found');
        set({
          attendedEvents: [],
          isLoadingAttended: false,
          retryCount: 0,
          attendedError: null
        });
        return { success: true, data: [] };
      }

      if (!response.data || response.data.status !== 200) {
        console.error('Invalid response format:', response.data);
        throw new Error(response.data?.message || 'Failed to fetch attended events');
      }

      const events = response.data.data || [];
      console.log('Parsed attended events:', events);
      set({
        attendedEvents: events,
        isLoadingAttended: false,
        retryCount: 0,
        attendedError: null
      });

      return { success: true, data: events };
    } catch (error) {
      console.error('Error in getAttendedEvents:', error);
      const errorMessage = getErrorMessage(error);

      set({
        isLoadingAttended: false,
        attendedError: errorMessage
      });

      if (
        (error.message.includes('network') ||
          error.message.includes('timeout') ||
          error.response?.status === 500) &&
        !isRetry
      ) {
        console.log('Retrying getAttendedEvents...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return await get().getAttendedEvents(true);
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Đăng ký tham gia event
  registerEvent: async (eventId) => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_BASE_URL}/events/register/${eventId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'image/png'
      }
    });
    // console.log('Response status:', response);
    
    const arrayBuffer = await response.arrayBuffer();
    const base64 = base64Encode(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    );
    const imageDataUrl = `data:image/png;base64,${base64}`;
    // console.log('Image data URL:', imageDataUrl);
    return {
      success: true,
      data: imageDataUrl,
    };
  } catch (error) {
    console.error("Error registering for event:", error);
    return {
      success: false,
      error: error.message,
    };
  }
},

  // Tạo event mới
  createEvent: async (eventData, formData) => {
    try {
      const response = await api.post('/events', formData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data'
        }
      });

      if (!response.data || response.data.status !== 200) {
        throw new Error(response.data?.message || 'Failed to create event');
      }

      // Refresh my events list after creating new event
      await get().getMyEvents();

      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error creating event:', error);
      const errorMessage = getErrorMessage(error);
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Lấy thông tin chi tiết của một sự kiện
  getEventDetail: async (eventId) => {
    try {
      set({ isLoading: true, error: null });
      console.log('Fetching event detail for ID:', eventId);

      const response = await retryOperation(async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        try {
          console.log('Making request to /events');
          const response = await api.get('/events', {
            params: {
              pageSize: 100 // Lấy nhiều sự kiện hơn để tăng khả năng tìm thấy
            },
            signal: controller.signal,
            validateStatus: function (status) {
              return status === 200 || status === 404;
            }
          });
          console.log('Response from /events:', response.data);

          clearTimeout(timeoutId);
          return response;
        } catch (error) {
          clearTimeout(timeoutId);
          console.error('Error in getEventDetail request:', error);
          throw error;
        }
      });

      if (response.status === 404) {
        throw new Error('Event does not exist');
      }

      if (!response.data || response.data.status !== 200) {
        throw new Error(response.data?.message || 'Unable to get event information');
      }

      // Tìm sự kiện có id trùng khớp
      const eventDetail = response.data.data?.find(event => event.id === eventId);
      if (!eventDetail) {
        throw new Error('Event information not found');
      }

      // set({ isLoading: false, error: null });

      return { 
        success: true, 
        data: eventDetail 
      };
    } catch (error) {
      console.error('Error in getEventDetail:', error);
      const errorMessage = getErrorMessage(error);
      set({ 
        isLoading: false,
        error: errorMessage
      });
      return {
        success: false,
        error: errorMessage
      };
    }
  }
})); 