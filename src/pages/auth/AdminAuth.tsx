
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardPath } from '@/utils/navigation';
import { toast } from '@/components/ui/use-toast';

interface AdminAuthProps {
  type: 'login' | 'signup';
}

const AdminAuth = ({ type }: AdminAuthProps) => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      if (user.role !== 'admin') {
        // If not admin, force logout and show error
        toast({
          title: 'Access Denied',
          description: 'You must be an admin to log in here.',
          variant: 'destructive',
        });
        logout();
        return;
      }
      navigate(getDashboardPath(user.role), { replace: true });
    }
  }, [user, loading, navigate, logout]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <AuthForm type={type} userType="admin" />
      </div>
    </div>
  );
};

export default AdminAuth;
