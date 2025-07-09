
import api from './api';

export type UserRole = 'admin' | 'seller' | 'affiliate' | 'customer' | 'guest';

// ====================================================================
// START: CANONICAL TYPE DEFINITIONS
// These interfaces should perfectly match the backend database models.
// ====================================================================

export interface Profile {
  id: string;
  user_id: string;
  name?: string;
  bio?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  zip_code?: string;
  created_at: string;
  updated_at: string;
}

export interface SellerProfile {
  id: string;
  user_id: string;
  business_name?: string;
  business_description?: string;
  business_logo?: string;
  business_banner?: string;
  business_email?: string;
  business_phone?: string;
  business_address?: string;
  business_city?: string;
  business_state?: string;
  business_country?: string;
  business_zip_code?: string;
  business_website?: string;
  tax_id?: string;
  commission_rate: number;
  payment_details?: string;
  paypal_email?: string;
  bank_account?: string;
  is_verified: boolean;
  verification_documents?: string;
  created_at: string;
  updated_at: string;
}

export interface AffiliateProfile {
  id: string;
  user_id: string;
  website?: string;
  social_media?: string;
  niche?: string;
  audience_size?: number;
  commission_rate: number;
  payment_details?: string;
  paypal_email?: string;
  bank_account?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

// This is the canonical User object, aggregating all possible data.
export interface User {
  id: string;
  email: string;
  role: UserRole;
  is_email_verified: boolean;
  created_at: string;
  updated_at: string;
  profile?: Profile;
  seller_profile?: SellerProfile;
  affiliate_profile?: AffiliateProfile;
}

// ====================================================================
// END: CANONICAL TYPE DEFINITIONS
// ====================================================================

export const loginUser = async (email: string, password: string): Promise<User | null> => {
  try {
    console.log('[DEBUG] About to send login request:', { email });
    const response = await api.post('/auth/login', { email, password });
    console.log('[DEBUG] Login response status:', response.status);
    
    if (response.data && response.data.user && response.data.access_token) {
      // Store the token first so subsequent API calls can use it
      localStorage.setItem('token', response.data.access_token);
      
      // Store the user data
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Store refresh token if available
      if (response.data.refresh_token) {
        localStorage.setItem('refresh_token', response.data.refresh_token);
      }
      
      console.log('[DEBUG] User data stored in localStorage');
      return response.data.user;
    }
    
    console.warn('[DEBUG] Login response missing user or token');
    return null;
  } catch (error: any) {
    console.error('[DEBUG] Login error:', error, error.response?.data?.message || error.message);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // First try to get the user from localStorage
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    // If we don't have a token, we can't make authenticated requests
    if (!storedToken) {
      console.log('No token found in localStorage');
      return null;
    }
    
    console.log('Fetching current user profile from /profile/me');
    // Use the /profile/me endpoint that returns the full user object with profiles
    const response = await api.get('/profile/me');
    
    if (response.data) {
      console.log('User profile fetched successfully:', response.data);
      // Store the updated user data in localStorage
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    }
    
    // If we get here, the response was successful but didn't contain user data
    console.warn('Response from /profile/me did not contain user data');
    return null;
  } catch (error: any) {
    console.error('Error fetching current user:', error);
    
    // When the token is invalid or expired, the server returns a 401 or 422.
    // In that case, we should clear the local storage.
    if (error.response && (error.response.status === 401 || error.response.status === 422)) {
      console.warn('Authentication error, clearing user data');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return null;
    }
    
    // If it's a 404, the endpoint might not exist, try the old endpoint
    if (error.response && error.response.status === 404) {
      try {
        console.log('Trying fallback to /profile/ endpoint');
        const fallbackResponse = await api.get('/profile/');
        if (fallbackResponse.data) {
          // We got profile data, but we need to combine it with the stored user data
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const user = JSON.parse(storedUser);
            user.profile = fallbackResponse.data;
            localStorage.setItem('user', JSON.stringify(user));
            return user;
          }
        }
      } catch (fallbackError) {
        console.error('Fallback profile fetch failed:', fallbackError);
      }
    }
    
    return null;
  }
};

// Logout function
export const logoutUser = async (): Promise<void> => {
  try {
    // Try to call the logout endpoint, but don't wait for it to complete
    // This way, even if the server is down, we still clear local storage
    api.post('/auth/logout').catch(error => {
      console.warn('Error during logout API call:', error);
    });
  } finally {
    // Always clear local storage, even if the API call fails
    console.log('Clearing authentication data from localStorage');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
  }
};

// Sign up new user
// Verify user's email
export const verifyEmail = async (token: string): Promise<{ success: boolean, user: User | null, error?: string }> => {
  try {
    const response = await api.get(`/auth/verify-email?token=${token}`);
    if (response.data && response.data.user) {
      return { success: true, user: response.data.user };
    }
    return { success: false, user: null, error: response.data?.message || 'Unknown error' };
  } catch (error: any) {
    return { success: false, user: null, error: error.response?.data?.message || 'Verification failed' };
  }
};

// Sign up new user
export const signUpUser = async (
  email: string,
  password: string,
  role: UserRole,
  name: string
): Promise<{ success: boolean, error?: string }> => {
  try {
    const response = await api.post('/auth/register', {
      email,
      password,
      role,
      name
    });
    // A successful registration returns a userId. This is the correct check.
    if (response.data && response.data.userId) {
      return { success: true };
    }
    // If there's no userId, it's an error, even if the request didn't throw.
    return { success: false, error: response.data?.message || 'Unknown error during registration' };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || 'Signup failed' };
  }
};
