// Base URL for your API - update this to your Python backend URL
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

// Store the auth token
let authToken = null;

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Something went wrong');
  }
  return response.json();
};

// Set the auth token after login
export const setAuthToken = (token) => {
  authToken = token;
};

// Clear the auth token on logout
export const clearAuthToken = () => {
  authToken = null;
};

// Get the auth token
export const getAuthToken = () => authToken;

// Create default headers for requests
const createHeaders = () => {
  console.log('Current authToken:', authToken); // Debug log for authToken
  const headers = {
    'Content-Type': 'application/json',
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`; // Ensure the token is included
  }

  console.log('Generated headers:', headers); // Debug log for headers
  return headers;
};

// API request functions
export const api = {
  // Auth endpoints
  auth: {
    // Send OTP to phone number
    sendOtp: async (phone) => {
      const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify({ phone }),
      });
      return handleResponse(response);
    },

    // Verify OTP and register user
    register: async (phone, otp, pin) => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify({ phone, otp, pin }),
      });
      const data = await handleResponse(response);
      if (data.token) {
        setAuthToken(data.token);
      }
      return data;
    },

    // Login with phone and PIN
    login: async (phone, pin) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify({ phone, pin }),
      });
      const data = await handleResponse(response);
      if (data.token) {
        setAuthToken(data.token);
      }
      return data;
    },

    // Reset PIN
    resetPin: async (phone, otp, newPin) => {
      const response = await fetch(`${API_BASE_URL}/auth/reset-pin`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify({ phone, otp, newPin }),
      });
      return handleResponse(response);
    },

    // Logout
    logout: async () => {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: createHeaders(),
      });
      clearAuthToken();
      return handleResponse(response);
    },
  },

  // User endpoints
  user: {
    // Get user profile
    getProfile: async () => {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        headers: createHeaders(),
      });
      return handleResponse(response);
    },

    // Update user profile
    updateProfile: async (profileData) => {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'PUT',
        headers: createHeaders(),
        body: JSON.stringify(profileData),
      });
      return handleResponse(response);
    },

    // Get user wallet balance
    getWalletBalance: async () => {
      const response = await fetch(`${API_BASE_URL}/user/wallet`, {
        headers: createHeaders(),
      });
      return handleResponse(response);
    },

    // Get user transactions
    getTransactions: async () => {
      const response = await fetch(`${API_BASE_URL}/user/transactions`, {
        headers: createHeaders(),
      });
      return handleResponse(response);
    },
  },

  // Group endpoints
  groups: {
    // Get all groups for the user
    getGroups: async () => {
      const response = await fetch(`${API_BASE_URL}/groups`, {
        headers: createHeaders(), // Ensure headers include the Authorization token
      });
      return handleResponse(response);
    },

    // Get a specific group
    getGroup: async (groupId) => {
      const response = await fetch(`${API_BASE_URL}/groups${groupId}`, {
        headers: createHeaders(),
      });
      return handleResponse(response);
    },

    // Create a new group
    createGroup: async (groupData) => {
      const response = await fetch(`${API_BASE_URL}/groups`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(groupData),
      });
      return handleResponse(response);
    },

    // Join a group
    joinGroup: async (groupCode) => {
      const response = await fetch(`${API_BASE_URL}/groups/join`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify({ groupCode }),
      });
      return handleResponse(response);
    },

    // Get group by code (for preview before joining)
    getGroupByCode: async (groupCode) => {
      const response = await fetch(`${API_BASE_URL}/groups/code/${groupCode}`, {
        headers: createHeaders(),
      });
      return handleResponse(response);
    },

    // Get group members
    getGroupMembers: async (groupId) => {
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}/members`, {
        headers: createHeaders(),
      });
      return handleResponse(response);
    },

    // Get group contributions
    getGroupContributions: async (groupId) => {
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}/contributions`, {
        headers: createHeaders(),
      });
      return handleResponse(response);
    },

    // Get group rotation schedule
    getGroupRotation: async (groupId) => {
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}/rotation`, {
        headers: createHeaders(),
      });
      return handleResponse(response);
    },

    // Get group announcements
    getGroupAnnouncements: async (groupId) => {
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}/announcements`, {
        headers: createHeaders(),
      });
      return handleResponse(response);
    },
  },

  // Contribution endpoints
  contributions: {
    // Make a contribution
    makeContribution: async (groupId, amount, paymentMethod) => {
      const response = await fetch(`${API_BASE_URL}/contributions`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify({ groupId, amount, paymentMethod }),
      });
      return handleResponse(response);
    },

    // Get payment methods
    getPaymentMethods: async () => {
      const response = await fetch(`${API_BASE_URL}/payment-methods`, {
        headers: createHeaders(),
      });
      return handleResponse(response);
    },

    // Verify payment (for mobile money callbacks)
    verifyPayment: async (transactionId) => {
      const response = await fetch(`${API_BASE_URL}/contributions/verify/${transactionId}`, {
        headers: createHeaders(),
      });
      return handleResponse(response);
    },
  },

  // Loan endpoints
  loans: {
    // Request a loan
    requestLoan: async (loanData) => {
      const response = await fetch(`${API_BASE_URL}/loans`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(loanData),
      });
      return handleResponse(response);
    },

    // Get user's loans
    getUserLoans: async () => {
      const response = await fetch(`${API_BASE_URL}/loans/user`, {
        headers: createHeaders(),
      });
      return handleResponse(response);
    },

    // Get group loans (admin only)
    getGroupLoans: async (groupId) => {
      const response = await fetch(`${API_BASE_URL}/loans/group/${groupId}`, {
        headers: createHeaders(),
      });
      return handleResponse(response);
    },
  },
};

// Debug log to verify the structure of the exported API object
// console.log('Exporting API object:', api);

export default api;