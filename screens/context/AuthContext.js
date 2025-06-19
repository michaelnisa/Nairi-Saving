import { Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useContext, useEffect } from 'react';
import api, { setAuthToken } from '../../api'; // Use setAuthToken from api/index.js

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
  const navigation = useNavigation(); // Use navigate from NavigationContext

  // Check for stored token on app start
  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          console.log('Token found, setting auth token:', token); // Debug log
          setAuthToken(token); // Ensure token is set for all API requests
          // Fetch user profilese
          const userData = await api.get('/user/me'); // Correct endpoint / add user/me/remove use/profile
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
      console.log('Calling API login with:', { phone, pin }); // Debug log
      const response = await api.auth.login(phone, pin);
      console.log('Login response:', response); // Log backend response

      const token = response.access_token; // Extract access_token
      if (token) {
        await AsyncStorage.setItem('authToken', token); // Save token securely
        setAuthToken(token); // Set token for API requests
        setUser(response.user); // Update authentication state
        navigation.navigate("Home");
      } else {
        console.error('Login failed: No access token received');
        throw new Error('No access token received');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (phone, otp, pin, name) => { // Use name directly
    setIsLoading(true);
    try {
      console.log('Calling API register with:', { phone, otp, pin, name }); // Debug log
      const response = await api.auth.register(phone, otp, pin, name); // Use name in API call
      console.log('Register response:', response); // Log backend response
      await AsyncStorage.setItem('authToken', response.token);
      setUser(response.user);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const sendOtp = async (phone) => {
    try {
      console.log('Calling API sendOtp with:', { phone }); // Debug log
      const response = await api.auth.sendOtp(phone);
      console.log('Send OTP response:', response); // Log backend response
    } catch (error) {
      console.error('Failed to send OTP:', error);
      throw error;
    }
  };

  const resetPin = async (phone, otp, newPin) => {
    try {
      console.log('Calling API resetPin with:', { phone, otp, newPin }); // Debug log
      const response = await api.auth.resetPin(phone, otp, newPin);
      console.log('Reset PIN response:', response); // Log backend response
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
      // Still remove token and user even if API call fails
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