import { useAuthStore } from '@/stores/useAuthStore';
import axios from 'axios';
import { getBaseApiUrl } from './api';
export const apiBaseURL = getBaseApiUrl();

// Create a base axios instance
const baseAxiosInstance = axios.create({
  baseURL: apiBaseURL,
  timeout: 20 * 1000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cache for the current token to avoid repeated store/localStorage access
let cachedToken: string | null = null;
let cachedLocalStorageToken: string | null = null;

// Function to get the current token (store first, then localStorage)
const getCurrentToken = (): string | null => {
  const storeToken = useAuthStore.getState().accessToken;
  if (storeToken) {
    return storeToken;
  }

  // Only check localStorage if we haven't cached it or if store token is null
  if (cachedLocalStorageToken === null) {
    cachedLocalStorageToken = localStorage.getItem('token');
  }
  return cachedLocalStorageToken;
};

// Function to update the Authorization header
const updateAuthHeader = (token: string | null) => {
  if (token) {
    baseAxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete baseAxiosInstance.defaults.headers.common['Authorization'];
  }
  cachedToken = token;
};

// Initialize with token from store/localStorage
const initializeToken = () => {
  const token = getCurrentToken();
  updateAuthHeader(token);
};

// Subscribe to auth store changes
useAuthStore.subscribe(() => {
  const newToken = getCurrentToken();
  if (newToken !== cachedToken) {
    updateAuthHeader(newToken);
  }
});

// Initialize token on module load
initializeToken();

export default function getAxiosClient() {
  return baseAxiosInstance;
}

export const HttpClient = baseAxiosInstance;
