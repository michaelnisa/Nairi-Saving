import axios from 'axios';

const api = {
  auth: {
    login: async (phoneNumber, pin) => {
      // Mock login response
      return { token: 'mockToken', user: { id: 1, phoneNumber } };
    },
    register: async (phoneNumber, otp, pin) => {
      // Mock register response
      return { token: 'mockToken', user: { id: 1, phoneNumber } };
    },
    sendOtp: async (phoneNumber) => {
      // Mock OTP sending
      console.log(`OTP sent to ${phoneNumber}`);
    },
    resetPin: async (phoneNumber, otp, newPin) => {
      // Mock PIN reset
      console.log(`PIN reset for ${phoneNumber}`);
    },
    logout: async () => {
      // Mock logout
      console.log('Logged out');
    },
  },
  user: {
    getProfile: async () => {
      // Mock user profile
      return { id: 1, phoneNumber: '1234567890' };
    },
  },
};

// Function to set the auth token for API requests
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export default api;
