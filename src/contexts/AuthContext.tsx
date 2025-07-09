import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  loginUser, 
  logoutUser, 
  signUpUser, 
  getCurrentUser, 
  isAuthenticated, 
  User, 
  UserRole 
} from '../services/authService';
import { isProfileComplete as checkProfileComplete } from '../utils/profile';
import { useToast } from '@/components/ui/use-toast';

// Re-export User and UserRole for convenience in other parts of the app
export type { User, UserRole };

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  signup: (userData: any) => Promise<boolean>;
  isAuthenticated: boolean;
  isProfileComplete: boolean;
  loading: boolean;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true);
      
      // Check if we have a token in localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, user is not authenticated');
        setLoading(false);
        return;
      }
      
      // Try to get the stored user from localStorage first
      const storedUserJson = localStorage.getItem('user');
      if (storedUserJson) {
        try {
          const storedUser = JSON.parse(storedUserJson);
          // Set the user from localStorage immediately to prevent flashing
          setUser(storedUser);
          console.log('User restored from localStorage:', storedUser);
        } catch (e) {
          console.error('Failed to parse stored user:', e);
          localStorage.removeItem('user');
        }
      }
      
      // Then try to fetch the latest user data from the server
      if (isAuthenticated()) {
        try {
          console.log('Fetching fresh user data from server...');
          const currentUser = await getCurrentUser();
          if (currentUser) {
            console.log('User data from getCurrentUser:', JSON.stringify(currentUser, null, 2));
            setUser(currentUser);
            
            // Debug: Let's check if our profile completeness check is working correctly
            const isComplete = checkProfileComplete(currentUser);
            console.log('Is profile complete?', isComplete);
            console.log('User role:', currentUser.role);
            console.log('Profile data:', currentUser.profile);
          } else {
            // If getCurrentUser returns null but we have a token, something is wrong
            console.error('Token exists but getCurrentUser returned null');
            if (storedUserJson) {
              // Keep using the stored user data if available
              console.log('Continuing with stored user data');
            } else {
              // Otherwise, log out
              console.log('No stored user data, logging out');
              await logoutUser();
              setUser(null);
            }
          }
        } catch (error) {
          console.error('Failed to fetch user on load:', error);
          // Don't log out automatically, just keep the stored user if available
          if (!storedUserJson) {
            console.log('No stored user data and fetch failed, logging out');
            await logoutUser();
            setUser(null);
          }
        }
      }
      setLoading(false);
    };
    checkAuthStatus();
  }, []);

    const login = async (email: string, password: string): Promise<User | null> => {
    setLoading(true);
    try {
      const loggedInUser = await loginUser(email, password);
      if (loggedInUser) {
        setUser(loggedInUser);
        toast({ title: 'Login Successful', description: `Welcome back, ${loggedInUser.profile?.name || loggedInUser.email}!` });

        const isComplete = checkProfileComplete(loggedInUser);

        if (isComplete) {
          switch (loggedInUser.role) {
            case 'admin':
              navigate('/admin/dashboard', { replace: true });
              break;
            case 'seller':
              navigate('/seller/dashboard', { replace: true });
              break;
            case 'affiliate':
              navigate('/affiliate/dashboard', { replace: true });
              break;
            default:
              navigate('/', { replace: true });
              break;
          }
        } else {
          toast({ title: 'Profile Incomplete', description: 'Please complete your profile to continue.' });
          switch (loggedInUser.role) {
            case 'admin':
              navigate('/admin/settings', { replace: true });
              break;
            case 'seller':
              navigate('/seller/settings', { replace: true });
              break;
            case 'affiliate':
              navigate('/affiliate/settings', { replace: true });
              break;
            default:
              navigate('/settings', { replace: true });
              break;
          }
        }

        return loggedInUser;
      }
      toast({ title: 'Login Failed', description: 'Please check your credentials and try again.', variant: 'destructive' });
      return null;
    } catch (error) {
      console.error('Login failed:', error);
      toast({ title: 'Login Failed', description: 'An unexpected error occurred.', variant: 'destructive' });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    // Remember the user's role before logging out
    const userRole = user?.role || 'seller';
    
    // Log the user out
    await logoutUser();
    setUser(null);
    
    // Redirect to the appropriate login page based on the user's role
    switch(userRole) {
      case 'admin':
        navigate('/admin/login', { replace: true });
        break;
      case 'affiliate':
        navigate('/affiliate/login', { replace: true });
        break;
      default:
        navigate('/seller/login', { replace: true });
        break;
    }
  };

  const signup = async (userData: any): Promise<boolean> => {
    setLoading(true);
    try {
      const result = await signUpUser(userData.email, userData.password, userData.role, userData.name);
      if (result.success) {
        // On success, we no longer show a toast here. 
        // The AuthForm will handle the redirect to the check-email page.
        return true;
      }
      // On failure, show the error message from the server.
      toast({ title: 'Signup Failed', description: result.error, variant: 'destructive' });
      return false;
    } catch (error: any) {
      console.error('Signup failed:', error);
      toast({ title: 'Signup Failed', description: error.message || 'An unknown error occurred.', variant: 'destructive' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const authenticated = !!user && isAuthenticated();
  const profileComplete = user ? checkProfileComplete(user) : false;

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      signup,
      isAuthenticated: authenticated,
      isProfileComplete: profileComplete,
      loading,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
