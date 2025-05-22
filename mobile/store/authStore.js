import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
//import { FIREBASE_APIKEY } from '@env'
import axios from 'axios'
import { useEventStore } from './eventStore'
//import { IP_ADDRESS } from '@env'
const FIREBASE_APIKEY = process.env.EXPO_PUBLIC_FIREBASE_APIKEY
const ip = process.env.EXPO_PUBLIC_IP_ADDRESS
const API_BASE_URL = `http://${ip}:8080/v1`

// Debug log để kiểm tra FIREBASE_API_KEY có được load đúng không
console.log('Firebase API Key:', FIREBASE_APIKEY);
console.log('Firebase API Key loaded:', FIREBASE_APIKEY ? 'Yes' : 'No');
if (!FIREBASE_APIKEY) {
  console.warn('FIREBASE_API_KEY is not loaded from .env file')
}

// Utility function để refresh token
const refreshTokenUtil = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    const response = await axios.post(
      `https://securetoken.googleapis.com/v1/token?key=${FIREBASE_APIKEY}`,
      `grant_type=refresh_token&refresh_token=${refreshToken}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    if (!response.data.id_token) {
      throw new Error('Invalid refresh token response');
    }

    await AsyncStorage.setItem('token', response.data.id_token);
    await AsyncStorage.setItem('refreshToken', response.data.refresh_token);

    return response.data.id_token;
  } catch (error) {
    throw new Error('Failed to refresh token');
  }
};

// Utility function để check token validity
const checkTokenValidity = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/info`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
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

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  events: [],
  lastDate: null,
  hasMoreEvents: true,
  pageSize: 10,
  isLoadingMore: false,

  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Reset events state
  resetEvents: () => {
    set({
      events: [],
      lastDate: null,
      hasMoreEvents: true,
      isLoading: false,
      isLoadingMore: false,
      error: null
    });
  },

  register: async (username, phone, email, password) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(`${API_BASE_URL}/users/register`, {
        username,
        phone,
        email,
        password
      });

      if (response.data.status !== 200 || !response.data.data) {
        throw new Error(response.data.message || "Registration failed");
      }

      const userData = response.data.data;
      const userToken = userData.id;

      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('token', userToken);

      set({ user: userData, token: userToken, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(`${API_BASE_URL}/users/login`, {
        email,
        password
      });

      if (response.data.status !== 200 || !response.data.data) {
        throw new Error(response.data.message || "Login failed");
      }

      const authData = response.data.data;
      await AsyncStorage.setItem('token', authData.idToken);
      await AsyncStorage.setItem('refreshToken', authData.refreshToken);

      // Get user info
      const userInfoResponse = await axios.get(`${API_BASE_URL}/users/info`, {
        headers: {
          'Authorization': `Bearer ${authData.idToken}`
        }
      });

      if (userInfoResponse.data.status !== 200 || !userInfoResponse.data.data) {
        throw new Error("Failed to get user information");
      }

      const userData = userInfoResponse.data.data;
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      set({
        user: userData,
        token: authData.idToken,
        isLoading: false
      });

      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userJson = await AsyncStorage.getItem('user');

      if (!token || !userJson) {
        return false;
      }

      const isValid = await retryOperation(async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/users/info`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          return response.status === 200;
        } catch (error) {
          if (error.response?.status === 401) {
            const newToken = await refreshTokenUtil();
            if (newToken) {
              const user = JSON.parse(userJson);
              set({ user, token: newToken });
              return true;
            }
          }
          throw error;
        }
      });

      if (isValid) {
        const user = JSON.parse(userJson);
        set({ user, token });
        return true;
      }

      await get().logout();
      return false;
    } catch (error) {
      console.error('Auth check failed:', error);
      return false;
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');

      // Reset state trong authStore
      set({
        user: null,
        token: null,
        isLoading: false,
        error: null
      });

      // Reset state trong eventStore
      const { resetEvents: resetEventStore } = useEventStore.getState();
      resetEventStore();

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  getUserInfo: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await fetch(`${API_BASE_URL}/users/info`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const responseData = await response.json();

      if (responseData.status !== 200) {
        throw new Error(responseData.message || "Something went wrong");
      }

      if (!responseData.data) {
        throw new Error("Invalid response format from server");
      }

      const userData = responseData.data;
      console.log('User Info Response:', userData);
      console.log('Created Events:', userData?.createdEvents);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      set({ user: userData });
      return { success: true, user: userData };
    } catch (error) {
      console.log('Get user info error:', error);
      return {
        success: false,
        error: error.message || "Something went wrong",
      }
    }
  },

  createEvent: async (eventData, formData) => {
    set({ isLoading: true });
    try {
      console.log('Bắt đầu tạo sự kiện...');
      console.log('Event Data chi tiết:', JSON.stringify(eventData, null, 2));
      console.log('Form Data chi tiết:', JSON.stringify(Array.from(formData._parts), null, 2));
      console.log('Form Data có phải FormData không:', formData instanceof FormData);
      console.log('Form Data entries:', Array.from(formData.entries()));

      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Vui lòng đăng nhập để tạo sự kiện');
      console.log('Token length:', token.length);

      // Kiểm tra token có hợp lệ không
      console.log('Kiểm tra token...');
      const userResponse = await axios.get(`${API_BASE_URL}/users/info`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Token check response:', userResponse.status);
      console.log('User info response:', userResponse.data);

      // Nếu token hết hạn
      if (userResponse.status === 401) {
        console.log('Token hết hạn, đang refresh...');
        // Lấy refresh token từ AsyncStorage
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (!refreshToken) {
          await get().logout();
          throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        }

        // Gọi Firebase để refresh token
        const response = await axios.post(`https://securetoken.googleapis.com/v1/token?key=${FIREBASE_APIKEY}`,
          `grant_type=refresh_token&refresh_token=${refreshToken}`,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        );

        if (!response.data.id_token) {
          await get().logout();
          throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        }

        // Lưu token mới
        await AsyncStorage.setItem('token', response.data.id_token);
        await AsyncStorage.setItem('refreshToken', response.data.refresh_token);
        set({ token: response.data.id_token });
        token = response.data.id_token;
      }

      console.log('Gửi request tạo sự kiện...');
      console.log('Request URL:', `${API_BASE_URL}/events`);
      console.log('Request Headers:', {
        'Authorization': `Bearer ${token.substring(0, 10)}...`,
        'Accept': 'application/json'
      });

      const response = await axios.post(`${API_BASE_URL}/events`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data'
        },
        transformRequest: [(data) => {
          console.log('Transform Request Data:', data);
          return data;
        }],
        timeout: 30000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        validateStatus: function (status) {
          return status >= 200 && status < 500;
        }
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      console.log('Response data:', response.data);

      if (response.data.status !== 200) {
        console.error('Lỗi từ server:', response.data);
        throw new Error(response.data.message || 'Tạo sự kiện thất bại');
      }

      console.log('Tạo sự kiện thành công!');
      // Cập nhật lại thông tin user sau khi tạo sự kiện thành công
      await get().getUserInfo();

      set({ isLoading: false });
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error in createEvent:', error.response?.data || error);
      set({ isLoading: false });
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Không thể tạo sự kiện. Vui lòng thử lại sau.'
      };
    }
  },

  refreshToken: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return { success: false };
      }

      const response = await fetch(`${API_BASE_URL}/users/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        return { success: false };
      }

      const data = await response.json();
      if (data.status !== 200 || !data.data || !data.data.token) {
        return { success: false };
      }

      // Lưu token mới
      await AsyncStorage.setItem('token', data.data.token);
      set({ token: data.data.token });

      return { success: true };
    } catch (error) {
      console.error('Refresh token error:', error);
      return { success: false };
    }
  },

  deleteAccount: async () => {
    set({ isLoading: true });
    try {
      const token = get().token;
      if (!token) throw new Error('Authentication required');

      const response = await axios.delete(`${API_BASE_URL}/users/info`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.status !== 200) {
        throw new Error(response.data.message || "Failed to delete account");
      }

      await get().logout();
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  getEvents: async (isLoadMore = false) => {
    // Nếu đang load more nhưng không còn data để load
    if (isLoadMore && !get().hasMoreEvents) {
      console.log('No more events to load');
      return { success: true, data: [] };
    }

    try {
      // Set loading state tương ứng
      set({
        isLoading: !isLoadMore,
        isLoadingMore: isLoadMore,
        error: null
      });

      const token = get().token;
      console.log('Current token:', token ? 'exists' : 'missing');

      // Nếu không có token, trả về mảng rỗng
      if (!token) {
        console.log('No token available');
        set({
          events: [],
          isLoading: false,
          isLoadingMore: false
        });
        return {
          success: false,
          error: 'Vui lòng đăng nhập để xem danh sách sự kiện'
        };
      }

      // Kiểm tra token có hợp lệ không
      try {
        const userResponse = await fetch(`${API_BASE_URL}/users/info`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // Nếu token hết hạn
        if (userResponse.status === 401) {
          console.log('Token expired, trying to refresh...');
          const refreshResult = await get().refreshToken();
          if (!refreshResult.success) {
            await get().logout();
            throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          }
          // Lấy token mới
          token = get().token;
        }
      } catch (error) {
        console.error('Error checking token:', error);
        throw new Error('Không thể xác thực phiên đăng nhập. Vui lòng đăng nhập lại.');
      }

      const lastDate = get().lastDate;
      const pageSize = get().pageSize;
      let url = `${API_BASE_URL}/events?pageSize=${pageSize}`;

      if (lastDate && isLoadMore) {
        url += `&lastDate=${encodeURIComponent(lastDate)}`;
      }

      console.log('API Request:', {
        url,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token.substring(0, 10)}...`,
          'Content-Type': 'application/json'
        }
      });

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Lỗi khi tải sự kiện: ${response.status}`);
      }

      const responseData = await response.json();

      if (responseData.status !== 200) {
        throw new Error(responseData.message || "Có lỗi xảy ra");
      }

      if (!responseData.data || !Array.isArray(responseData.data)) {
        console.error('Invalid response format:', responseData);
        throw new Error("Dữ liệu không hợp lệ từ server");
      }

      const events = responseData.data;
      console.log('API Response - Events count:', events.length);
      console.log('API Response - First event:', events[0]);
      console.log('API Response - Last event:', events[events.length - 1]);

      // Chỉ cập nhật lastDate nếu có events được trả về
      const newLastDate = events.length > 0 ? events[events.length - 1].date : get().lastDate;

      const currentEvents = get().events;
      const updatedEvents = isLoadMore ? [...currentEvents, ...events] : events;

      set({
        events: updatedEvents,
        lastDate: newLastDate,
        hasMoreEvents: events.length === pageSize,
        isLoading: false,
        isLoadingMore: false,
        error: null
      });

      return {
        success: true,
        data: events
      };
    } catch (error) {
      console.error('Error in getEvents:', error);
      set({
        isLoading: false,
        isLoadingMore: false,
        error: error.message
      });
      return {
        success: false,
        error: error.message
      };
    }
  },

  //lấy events đã tham dự
  getAttendedEvents: async () => {
    try {
      const token = get().token;
      if (!token) {
        return {
          success: false,
          error: 'Vui lòng đăng nhập để xem danh sách sự kiện đã tham dự'
        };
      }

      const response = await fetch(`${API_BASE_URL}/events/attended`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Lỗi khi tải sự kiện đã tham dự: ${response.status}`);
      }

      const responseData = await response.json();

      if (responseData.status !== 200) {
        throw new Error(responseData.message || "Có lỗi xảy ra");
      }

      return {
        success: true,
        data: responseData.data || []
      };
    } catch (error) {
      console.error('Error in getAttendedEvents:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  //đăng ký tham gia event
  registerEvent: async (eventId) => {
    try {
      const token = get().token;
      if (!token) {
        return {
          success: false,
          error: 'Vui lòng đăng nhập để đăng ký tham gia sự kiện'
        };
      }

      const response = await fetch(`${API_BASE_URL}/events/register/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Lỗi khi đăng ký tham gia: ${response.status}`);
      }

      // Response là QR code image
      const blob = await response.blob();
      return {
        success: true,
        data: URL.createObjectURL(blob)
      };
    } catch (error) {
      console.error('Error in registerEvent:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}));