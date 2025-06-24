import { API_BASE_URL, LOCAL_STORAGE_KEYS } from '@/utils/constants';

const getAuthHeaders = () => {
  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Auth API
export const getCurrentUser = async () => {
  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
  if (!token) return null;

  try {
    return await apiRequest('/me');
  } catch (error) {
    console.error('Error getCurrentUser:', error);
    return null;
  }
};

// Generic API methods
export const apiGet = (endpoint) => apiRequest(endpoint);
export const apiPost = (endpoint, data) => apiRequest(endpoint, {
  method: 'POST',
  body: JSON.stringify(data),
});
export const apiPut = (endpoint, data) => apiRequest(endpoint, {
  method: 'PUT',
  body: JSON.stringify(data),
});
export const apiDelete = (endpoint) => apiRequest(endpoint, {
  method: 'DELETE',
});
