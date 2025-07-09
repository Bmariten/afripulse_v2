import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AccountSettingsForm } from '@/components/settings/AccountSettingsForm';
import MainLayout from '@/components/layout/MainLayout';
import { useEffect } from 'react';
import api from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { User, Profile } from '@/services/authService';
import { isProfileComplete as checkProfileComplete } from '@/utils/profile';

const AdminSettings = () => {
  const { user, loading, updateUser, isProfileComplete } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      toast({ title: "Unauthorized", description: "You must be logged in as an admin to view this page.", variant: "destructive" });
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate, toast]);

  const handleUpdateProfile = async (data: Partial<Profile>) => {
    try {
      const response = await api.put('/profile/me', { profile: data });
      const updatedUser = response.data;
      updateUser(updatedUser);

      toast({
        title: "Settings updated",
        description: "Your profile has been successfully updated.",
      });

            if (checkProfileComplete(updatedUser)) {
        navigate('/admin/dashboard', { replace: true });
      }

      return true;
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast({
        title: "Update failed",
        description: "Could not update your settings. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  const initialData = {
    name: user.profile?.name || '',
    bio: user.profile?.bio || '',
    phone: user.profile?.phone || '',
    address: user.profile?.address || '',
    city: user.profile?.city || '',
    state: user.profile?.state || '',
    country: user.profile?.country || '',
    zip_code: user.profile?.postal_code || '',
  };

  return (
    <MainLayout showSidebar userRole="admin" pageTitle="Admin Settings">
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Admin Settings</CardTitle>
            <CardDescription>
              Manage your account settings. Complete your profile to access the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AccountSettingsForm
              userType="admin"
              initialData={initialData}
              onSubmit={handleUpdateProfile}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AdminSettings;
