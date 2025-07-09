import axios from 'axios';

// Main API instance that requires authentication for most endpoints
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
});

// Public API instance that doesn't require authentication
export const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
});

// Add interceptors for publicApi that don't reject requests without tokens
publicApi.interceptors.request.use((config) => {
  // Optionally add token if available, but don't require it
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  console.log(`[PUBLIC API REQUEST] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
    params: config.params,
    headers: config.headers,
    data: config.data
  });
  return config;
});

publicApi.interceptors.response.use(
  (response) => {
    console.log(`[PUBLIC API RESPONSE] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('[PUBLIC API ERROR]', {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  // Only reject non-auth requests if we're not trying to access public endpoints
  const publicEndpoints = ['/auth/login', '/auth/register', '/auth/verify', '/auth/reset-password'];
  const isPublicEndpoint = publicEndpoints.some(endpoint => config.url?.includes(endpoint));
  
  if (!token && !isPublicEndpoint && !config.url?.includes('/auth/')) {
    console.warn(`Request to ${config.url} rejected due to missing token`);
    return Promise.reject({
      message: 'Authentication required',
      isAuthError: true
    });
  }
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Added token to request:', config.url);
  }
  
  console.log(`[API REQUEST] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
    params: config.params,
    headers: config.headers,
    data: config.data
  });
  return config;
}, (error) => {
  console.error('[API REQUEST ERROR]', error);
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => {
    console.log(`[API RESPONSE] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    if (error.isAuthError) {
      return Promise.reject(error);
    }
    
    console.error('[API RESPONSE ERROR]', {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// Add default export to maintain compatibility with existing imports
export default api;
