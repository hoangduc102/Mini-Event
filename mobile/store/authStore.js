import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'

const API_BASE_URL = 'http://192.168.43.252:80/v1'

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

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

      // Lưu token trước
      await AsyncStorage.setItem('token', userToken);

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
      const token = get().token;
      if (!token) throw new Error('Vui lòng đăng nhập để tạo sự kiện');

      // Kiểm tra token hết hạn
      const user = get().user;
      if (!user) {
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }

      let headers = {
        'Authorization': `Bearer ${token}`
      };

      let requestBody;

      if (formData) {
        // Sử dụng FormData đã được tạo
        requestBody = formData;
      } else {
        // Tạo FormData mới cho trường hợp không có hình ảnh
        const newFormData = new FormData();
        newFormData.append('event', JSON.stringify(eventData));
        requestBody = newFormData;
      }

      console.log('API URL:', `${API_BASE_URL}/events`);
      console.log('Request headers:', headers);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 giây timeout

      const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: headers,
        body: requestBody,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('Response status:', response.status);
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (response.status === 401) {
        // Token hết hạn, logout và yêu cầu đăng nhập lại
        await get().logout();
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }

      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || 'Tạo sự kiện thất bại';
        } catch (e) {
          errorMessage = responseText || 'Tạo sự kiện thất bại';
        }
        throw new Error(errorMessage);
      }

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error('JSON parse error:', e);
        throw new Error('Invalid JSON response from server');
      }

      console.log('Parsed response data:', responseData);

      if (responseData.status === 200 || responseData.status === 201) {
        set({ isLoading: false });
        return {
          success: true,
          data: responseData.data
        };
      } else {
        throw new Error(responseData.message || 'Tạo sự kiện thất bại');
      }
    } catch (error) {
      console.error('Error in createEvent:', error);
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'Yêu cầu đã hết thời gian chờ. Vui lòng thử lại.'
        };
      }
      set({ isLoading: false });
      return {
        success: false,
        error: error.message || 'Không thể tạo sự kiện. Vui lòng thử lại sau.'
      };
    }
  },
}))

