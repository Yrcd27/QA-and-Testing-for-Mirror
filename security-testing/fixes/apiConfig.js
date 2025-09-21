import axios from 'axios';

// Create a centralized API configuration file
// This replaces hardcoded URLs scattered throughout the application

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create a base axios instance with common configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // Get token from secure storage
    const token = localStorage.getItem('token');
    
    // Add token to headers if available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is due to token expiration and we haven't retried yet
    if (error.response?.status === 401 && 
        error.response?.data?.code === 'TOKEN_EXPIRED' && 
        !originalRequest._retry) {
      
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh the token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken: localStorage.getItem('refreshToken'),
        });
        
        // Store the new token
        const { accessToken } = response.data;
        localStorage.setItem('token', accessToken);
        
        // Update the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        console.error('Error refreshing token:', refreshError);
        
        // Clear tokens
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        
        // Redirect to login page
        window.location.href = '/login?session=expired';
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// API function modules for different endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  refreshToken: (refreshToken) => api.post('/auth/refresh-token', { refreshToken }),
};

export const journalAPI = {
  getJournals: (page = 1, limit = 10) => 
    api.get(`/journals?page=${page}&limit=${limit}`),
  
  getJournal: (id) => api.get(`/journals/${id}`),
  
  createJournal: (journalData) => {
    // Special handling for form data with images
    const formData = new FormData();
    
    // Add text fields
    formData.append('content', journalData.content);
    if (journalData.mood) formData.append('mood', journalData.mood);
    
    // Add image if present
    if (journalData.image) formData.append('image', journalData.image);
    
    return api.post('/journals', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  updateJournal: (id, journalData) => {
    // Similar handling for updates with possible image uploads
    const formData = new FormData();
    formData.append('content', journalData.content);
    if (journalData.mood) formData.append('mood', journalData.mood);
    if (journalData.image) formData.append('image', journalData.image);
    
    return api.put(`/journals/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  deleteJournal: (id) => api.delete(`/journals/${id}`),
};

export const profileAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (profileData) => api.put('/profile', profileData),
};

export default api;