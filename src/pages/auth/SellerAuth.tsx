
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardPath } from '@/utils/navigation';
import { Loader2, Store } from 'lucide-react';

interface SellerAuthProps {
  type: 'login' | 'signup';
}

const SellerAuth = ({ type }: SellerAuthProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate(getDashboardPath(user.role), { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading || user) {
    // Prevent flash of login page while checking auth state or redirecting
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        <p className="mt-4 text-sm text-blue-800 font-medium">Loading your seller account...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-600/10 flex items-center justify-center">
              <Store className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-blue-800 mb-2">
            {type === 'login' ? 'Seller Login' : 'Become a Seller'}
          </h1>
          <p className="text-blue-700 opacity-90">
            {type === 'login' 
              ? 'Access your seller dashboard to manage your products' 
              : 'Create a seller account to start selling your products'}
          </p>
        </div>
        <AuthForm type={type} userType="seller" />
      </div>
    </div>
  );
};

export default SellerAuth;
