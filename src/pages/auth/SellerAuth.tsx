
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardPath } from '@/utils/navigation';

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
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>; 
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <AuthForm type={type} userType="seller" />
      </div>
    </div>
  );
};

export default SellerAuth;
