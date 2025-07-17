
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardPath } from '@/utils/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ShieldAlert } from 'lucide-react';

interface AdminAuthProps {
  type: 'login' | 'signup';
}

const AdminAuth = ({ type }: AdminAuthProps) => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-violet-100">
        <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
        <p className="mt-4 text-sm text-purple-800 font-medium">Loading admin portal...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-600/10 flex items-center justify-center">
              <ShieldAlert className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-purple-800 mb-2">
            {type === 'login' ? 'Admin Portal' : 'Admin Registration'}
          </h1>
          <p className="text-purple-700 opacity-90">
            {type === 'login' 
              ? 'Access the admin dashboard to manage the platform' 
              : 'Create an admin account with full platform privileges'}
          </p>
        </div>
        <AuthForm type={type} userType="admin" />
      </div>
    </div>
  );
};

export default AdminAuth;
