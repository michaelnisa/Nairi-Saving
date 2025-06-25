import axios from 'axios';

// Set the base URL for the API/
axios.defaults.baseURL = 'http://192.168.1.105:8000/api/v1';'; // Replace with your computer'

const api = {
  auth: {
    register: async (phone, otp, pin, name) => {
      const response = await axios.post('/auth/register', { phone, otp, pin, name });
      return response.data;
    },
    login: async (phone, pin) => {
      try {
        const response = await axios.post('/auth/login', { phone, pin });
        return response.data;
      } catch (error) {
        console.error('Login API error:', error.response?.data || error.message);
        throw error;
      }
    },
    logout: async () => {
      const response = await axios.post('/auth/logout');
      return response.data;
    },
    getMe: async () => {
      const response = await axios.get('/user/me');
      return response.data;
    },
    sendOtp: async (phone) => {
      // Backend expects POST /auth/resend-otp with { phone }
      const response = await axios.post('/auth/resend-otp', { phone_number: phone });
      return response.data;
    },
  },
  user: {
    getProfile: async () => {
      // Backend: GET /user/me
      const response = await axios.get('/user/me');
      return response.data;
    },
    getBalance: async () => {
      // Backend: GET /user/me/balance
      const response = await axios.get('/user/me/balance');
      return response.data;
    },
    getTransactions: async () => {
      // Backend: GET /user/me/transactions
      const response = await axios.get('/user/me/transactions');
      return response.data;
    },
    // Remove or fix updateProfile if not supported by backend
    // updateProfile: async (profileData) => { ... }
  },
  groups: {
    createGroup: async (groupData) => {
      const response = await axios.post('/groups', groupData);
      return response.data;
    },
    getUserGroups: async () => {
      const response = await axios.get('/groups');
      return response.data;
    },
    getGroup: async (groupId) => {
      const response = await axios.get(`/groups/${groupId}`);
      return response.data;
    },
    updateGroup: async (groupId, groupData) => {
      const response = await axios.put(`/groups/${groupId}`, groupData);
      return response.data;
    },
    getGroupMembers: async (groupId) => {
      const response = await axios.get(`/groups/${groupId}/members`);
      return response.data;
    },
    addGroupMember: async (groupId, memberData) => {
      const response = await axios.post(`/groups/${groupId}/members`, memberData);
      return response.data;
    },
    updateGroupMember: async (groupId, memberId, memberData) => {
      const response = await axios.put(`/groups/${groupId}/members/${memberId}`, memberData);
      return response.data;
    },
    removeGroupMember: async (groupId, memberId) => {
      const response = await axios.delete(`/groups/${groupId}/members/${memberId}`);
      return response.data;
    },
  },
  payments: {
    topup: async (paymentData) => {
      // Backend: POST /payments/topup
      const response = await axios.post('/payments/topup', paymentData);
      return response.data;
    },
    contribute: async (paymentData) => {
      // Backend: POST /payments/contribute
      const response = await axios.post('/payments/contribute', paymentData);
      return response.data;
    },
    getGroupTransactions: async (groupId) => {
      const response = await axios.get(`/payments/group/${groupId}`);
      return response.data;
    },
    getUserTransactions: async () => {
      const response = await axios.get('/payments/user');
      return response.data;
    },
    // Remove paymentCallback if not supported by backend
  },
  announcements: {
    createAnnouncement: async (announcementData) => {
      const response = await axios.post('/announcements/', announcementData);
      return response.data;
    },
    getGroupAnnouncements: async (groupId) => {
      const response = await axios.get(`/announcements/group/${groupId}`);
      return response.data;
    },
    getAnnouncement: async (announcementId) => {
      const response = await axios.get(`/announcements/${announcementId}`);
      return response.data;
    },
    updateAnnouncement: async (announcementId, announcementData) => {
      const response = await axios.put(`/announcements/${announcementId}`, announcementData);
      return response.data;
    },
    deleteAnnouncement: async (announcementId) => {
      const response = await axios.delete(`/announcements/${announcementId}`);
      return response.data;
    },
  },
  otp: {
    verifyOtp: async (otpData) => {
      const response = await axios.post('/auth/verify', otpData);
      return response.data;
    },
    sendSms: async (phone) => {
      const response = await axios.post('/sms/send', {phone});
      return response.data;
    },
    incomingMessage: async (messageData) => {
      const response = await axios.post('/otp/webhooks/incoming', messageData);
      return response.data;
    },
    deliveryReport: async (reportData) => {
      const response = await axios.post('/otp/webhooks/delivery-report', reportData);
      return response.data;
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