import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Website Status API
export const websiteStatusApi = {
  // Get all website statuses
  getAllStatus: async () => {
    try {
      const response = await apiClient.get('/status/websites');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch website status:', error);
      throw error;
    }
  },

  // Get specific website status
  getWebsiteStatus: async (website) => {
    try {
      const response = await apiClient.get(`/status/websites/${website}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch status for ${website}:`, error);
      throw error;
    }
  },

  // Get uptime data
  getUptimeData: async () => {
    try {
      const response = await apiClient.get('/status/uptime');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch uptime data:', error);
      throw error;
    }
  },

  // Force status check
  forceStatusCheck: async () => {
    try {
      const response = await apiClient.post('/status/check');
      return response.data;
    } catch (error) {
      console.error('Failed to force status check:', error);
      throw error;
    }
  }
};

// Health check API
export const healthApi = {
  checkHealth: async () => {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }
};

export default apiClient;