// src/lib/api.js
import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const companyId = localStorage.getItem('company_id');
    // const subdomain = localStorage.getItem('company_subdomain');

    // Check if it's a public auth route (no token/company context yet)
    const publicAuthRoutes = ['/auth/login', '/auth/register', '/auth/company/', '/auth/verify-company'];
    const isPublicAuthRoute = publicAuthRoutes.some(route => config.url?.includes(route));

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add company ID to requests except public auth routes
    if (companyId && !isPublicAuthRoute) {
      config.headers['x-company-id'] = companyId;
    }

    // Don't block public auth routes without company context
    // Block other routes without company context if a token is present
    if (!companyId && !isPublicAuthRoute && token) {
      console.error('Company context missing! Redirecting to login.');
      localStorage.removeItem('token');
      localStorage.removeItem('hrms_user');
      localStorage.removeItem('company_id');
      localStorage.removeItem('company_subdomain');
      window.location.href = '/signin';
      return Promise.reject(new Error('Company context required'));
    }

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('hrms_user');
      // window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// API methods
export const apiClient = {
  // GET request
  get: (url, config = {}) => api.get(url, config),

  // POST request  
  post: (url, data, config = {}) => api.post(url, data, config),

  // PUT request
  put: (url, data, config = {}) => api.put(url, data, config),

  // DELETE request
  delete: (url, config = {}) => api.delete(url, config),

  // PATCH request
  patch: (url, data, config = {}) => api.patch(url, data, config),
};

export default api;