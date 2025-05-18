import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { FIREBASE_APIKEY } from '@env'
import axios from 'axios'

const API_BASE_URL = 'http://192.168.43.252:80/v1'

// Debug log để kiểm tra FIREBASE_API_KEY có được load đúng không
console.log('Firebase API Key:', FIREBASE_APIKEY);
console.log('Firebase API Key loaded:', FIREBASE_APIKEY ? 'Yes' : 'No');
if (!FIREBASE_APIKEY) {
  console.warn('FIREBASE_API_KEY is not loaded from .env file')
}

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
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          username,
          phone,
          email,
          password
        })
      })

      const responseData = await response.json()
      console.log('Registration response:', responseData);

      if (responseData.status !== 200) {
        throw new Error(responseData.message || "Something went wrong");
      }

      if (!responseData.data) {
        throw new Error("Invalid response format from server");
      }

      const userData = responseData.data;
      const userToken = userData.id;

      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('token', userToken);

      set({ user: userData, token: userToken, isLoading: false });

      return {
        success: true,
      }
    
    } catch (error) {
      console.log('Registration error:', error);
      set({ isLoading: false });
      return {
        success: false,
        error: error.message || "Something went wrong",
      }
    } 
  },

  checkAuth: async () => {
    try{
      const token = await AsyncStorage.getItem('token');
      const userJson = await AsyncStorage.getItem('user');
      const user = userJson ? JSON.parse(userJson) : null;
      
      set({user, token});
    }catch(error){
      console.log('Auth check failed ', error);
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('token');
    set({user: null, token: null});
  },

  login: async (email, password) => {
    set({isLoading: true});
    try{
      console.log('Attempting login with:', { email });
      
      // 1. Xác thực với Firebase
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email, 
          password
        }),
      });

      console.log('Login response status:', response.status);
      const responseData = await response.json();
      console.log('Login response data:', responseData);

      if (responseData.status !== 200) {
        throw new Error(responseData.message || "Something went wrong");
      }

      if (!responseData.data) {
        throw new Error("Invalid response format from server");
      }

      const authData = responseData.data;
      const userToken = authData.idToken;
      const refreshToken = authData.refreshToken;

      // Lưu token
      await AsyncStorage.setItem('token', userToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);

      // 2. Lấy thông tin user đầy đủ
      const userInfoResponse = await fetch(`${API_BASE_URL}/users/info`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      });

      const userInfoData = await userInfoResponse.json();
      console.log('User info response:', userInfoData);

      if (userInfoData.status !== 200 || !userInfoData.data) {
        throw new Error("Failed to get user information");
      }

      const fullUserData = userInfoData.data;

      // Lưu thông tin user đầy đủ
      await AsyncStorage.setItem('user', JSON.stringify(fullUserData));
      set({
        user: fullUserData,
        token: userToken,
        isLoading: false
      });
      
      return {
        success: true,
      }
    }catch(error){
      console.log('Login error:', error);
      set({isLoading: false});
      return {
        success: false,
        error: error.message || "Something went wrong",
      }
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
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Vui lòng đăng nhập để tạo sự kiện');

      // Kiểm tra token có hợp lệ không
      const userResponse = await axios.get(`${API_BASE_URL}/users/info`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Nếu token hết hạn
      if (userResponse.status === 401) {
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

      console.log('Request body:', formData._parts);

      const response = await axios.post(`${API_BASE_URL}/events`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Response:', response.data);

      if (response.data.status !== 200) {
        throw new Error(response.data.message || 'Tạo sự kiện thất bại');
      }

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
      if (!token) throw new Error('Vui lòng đăng nhập để xóa tài khoản');

      const response = await fetch(`${API_BASE_URL}/users/info`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const responseData = await response.json();

      if (response.status === 401) {
        await get().logout();
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }

      if (responseData.status !== 200) {
        throw new Error(responseData.message || "Không thể xóa tài khoản");
      }

      // Nếu xóa thành công trên server, thực hiện logout
      await get().logout();
      set({ isLoading: false });
      
      return {
        success: true
      };
    } catch (error) {
      console.error('Delete account error:', error);
      set({ isLoading: false });
      return {
        success: false,
        error: error.message || "Không thể xóa tài khoản. Vui lòng thử lại sau."
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

      console.log('Response status:', response.status);

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
}));