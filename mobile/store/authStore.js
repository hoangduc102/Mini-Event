import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'

const API_BASE_URL = 'http://localhost/v1'

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,

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

      const data = await response.json()
      console.log('Registration response:', data);

      if (!response.ok) throw new Error(data.message) || "Something went wrong";

      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      await AsyncStorage.setItem('token', data.token);

      set({ user: data.user, token: data.token, isLoading: false });

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

      const data = await response.json();

      if (!response.ok) throw new Error(data.message) || "Something went wrong";

      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      await AsyncStorage.setItem('token', data.token);

      set({user: data.user, token: data.token, isLoading: false});
      
      return {
        success: true,
      }
    }catch(error){
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

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      set({ user: data });
      return { success: true, user: data };
    } catch (error) {
      console.log('Get user info error:', error);
      return {
        success: false,
        error: error.message || "Something went wrong",
      }
    }
  }
}))

