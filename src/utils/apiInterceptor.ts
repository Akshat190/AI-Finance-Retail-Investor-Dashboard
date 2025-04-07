import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { refreshTokenIfNeeded, isTokenExpired } from './supabaseClient';
import { toast } from 'react-hot-toast';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
api.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    try {
      // Check if token is about to expire and refresh if needed
      const tokenNeedsRefresh = await isTokenExpired();
      if (tokenNeedsRefresh) {
        await refreshTokenIfNeeded();
      }
      
      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return Promise.reject(error);
    }
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    // If error is 401 (Unauthorized), token might be expired
    if (error.response?.status === 401 && originalRequest) {
      try {
        // Attempt to refresh token
        await refreshTokenIfNeeded();
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Token refresh failed - user must login again
        toast.error('Session expired. Please login again.');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 