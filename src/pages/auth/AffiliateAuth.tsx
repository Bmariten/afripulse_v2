
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardPath } from '@/utils/navigation';
import { Loader2 } from 'lucide-react';

interface AffiliateAuthProps {
  type: 'login' | 'signup';
}

const AffiliateAuth = ({ type }: AffiliateAuthProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate(getDashboardPath(user.role), { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading || user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
        <p className="mt-4 text-sm text-green-800 font-medium">Loading your account...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-green-800 mb-2">
            {type === 'login' ? 'Affiliate Login' : 'Join as an Affiliate'}
          </h1>
          <p className="text-green-700 opacity-90">
            {type === 'login' 
              ? 'Access your affiliate dashboard and start earning' 
              : 'Create an affiliate account to promote products and earn commission'}
          </p>
        </div>
        <AuthForm type={type} userType="affiliate" />
      </div>
    </div>
  );
};

export default AffiliateAuth;
