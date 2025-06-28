import { Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useContext, useEffect } from 'react';
import api, { setAuthToken } from '../../api'; // Use setAuthToken from api/index.js
import axios from 'axios';

const AuthContext = createContext();

// Example animation function
const startAnimation = (animatedValue) => {
  Animated.timing(animatedValue, {
    toValue: 1,
    duration: 500,
    useNativeDriver: Animated.useNativeDriver !== undefined, // Fallback check
  }).start();
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  // Check for stored token on app start
  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          console.log('Token found, setting auth token:', token);
          setAuthToken(token);
          const userData = await api.get('/user/me');
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to load auth token:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadToken();
  }, []);

  const login = async (phone, pin) => {
    setIsLoading(true);
    try {
      // Convert phone to international format for login as well
      const phone_number = phone.startsWith('0') ? '255' + phone.slice(1) : phone;
      console.log('Calling API login with:', { phone: phone_number, pin });
      const response = await api.auth.login(phone_number, pin);
      console.log('Login response:', response);
      const token = response.access_token;
      if (token) {
        await AsyncStorage.setItem('authToken', token);
        setAuthToken(token);
        setUser(response.user);
        navigation.navigate("Home");
      } else {
        console.error('Login failed: No access token received');
        throw new Error('No access token received');
      }
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Login failed';
      console.error('Login failed:', error);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (phone, otp, pin, firstName, lastName) => {
    setIsLoading(true);
    try {
      console.log('Calling API register with:', { phone, otp, pin, firstName, lastName });
      const response = await api.auth.register(phone, otp, pin, firstName, lastName);
      console.log('Register response:', response);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const sendOtp = async (phone) => {
    try {
      console.log('Calling API sendOtp with:', { phone });
      const response = await api.auth.sendOtp(phone);
      console.log('Send OTP response:', response);
    } catch (error) {
      console.error('Failed to send OTP:', error);
      throw error;
    }
  };

  const verifyOtp = async (phone, otp) => {
    setIsLoading(true);
    try {
      // Convert phone to international format if required by backend (e.g., 255769424250)
      const phone_number = phone.startsWith('0') ? '255' + phone.slice(1) : phone;
      // The backend expects { phone_number, code }
      console.log('Calling API verifyOtp with:', { phone_number, code: otp });
      const response = await axios.post(
        'http://192.168.1.105:8000/api/v1/auth/verify',
        { phone_number, code: otp }
      );
      console.log('Verify OTP response:', response.data);
      return response.data;
    } catch (error) {
      console.error('OTP verification failed:', error);
      const message = error?.response?.data?.message || error.message || 'OTP verification failed';
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPin = async (phone_number, otp, newPin) => {
    try {
      console.log('Calling API resetPin with:', { phone_number, otp, newPin });
      const response = await api.auth.resetPin(phone, otp, newPin);
      console.log('Reset PIN response:', response);
    } catch (error) {
      console.error('Failed to reset PIN:', error);
      throw error;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.auth.logout();
      await AsyncStorage.removeItem('authToken');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      await AsyncStorage.removeItem('authToken');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        sendOtp,
        verifyOtp,
        resetPin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;