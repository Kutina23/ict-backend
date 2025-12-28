import axios from 'axios';

// Create an axios instance with the base URL from the environment
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add a request interceptor to include the JWT token in the headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle specific error status codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden - show an error message
          console.error('Forbidden: You do not have permission to access this resource');
          break;
        case 404:
          // Not Found - show an error message
          console.error('Not Found: The requested resource was not found');
          break;
        case 500:
          // Internal Server Error - show an error message
          console.error('Internal Server Error: Something went wrong on the server');
          break;
        default:
          console.error('An error occurred:', error.response.statusText);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from the server');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up the request:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;