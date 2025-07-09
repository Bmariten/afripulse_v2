import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AccountSettingsForm } from '@/components/settings/AccountSettingsForm';
import MainLayout from '@/components/layout/MainLayout';
import { useEffect } from 'react';
import api from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Profile, AffiliateProfile } from '@/services/authService';
import { isProfileComplete as checkProfileCompleteness } from '@/utils/profile';

const AffiliateSettings = () => {
  const { user, loading, updateUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'affiliate')) {
      toast({ title: "Unauthorized", description: "You must be logged in as an affiliate to view this page.", variant: "destructive" });
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate, toast]);

  const handleUpdateProfile = async (data: Partial<Profile & AffiliateProfile>) => {
    try {
      const profilePayload = {
        profile: {
          name: data.name,
          phone: data.phone,
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
          zip_code: data.zip_code, // Use zip_code directly from the form data
        },
      };

      const affiliateProfilePayload = {
        website: data.website,
        social_media: data.social_media,
        niche: data.niche,
        paypal_email: data.paypal_email,
        bank_account: data.bank_account,
      };

      // Update general and affiliate profiles
      await api.put('/profile/me', profilePayload);
      await api.put('/affiliate/profile', affiliateProfilePayload);

      // Refetch user data to get the fully updated state
      const response = await api.get('/profile/me');
      const updatedUser = response.data;
      updateUser(updatedUser);

      toast({
        title: "Settings updated",
        description: "Your profile has been successfully updated.",
      });

      if (checkProfileCompleteness(updatedUser)) {
        navigate('/affiliate/dashboard', { replace: true });
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

  // Combine base and affiliate profiles for the form
  const initialData = {
    name: user.profile?.name || '',
    phone: user.profile?.phone || '',
    address: user.profile?.address || '',
    city: user.profile?.city || '',
    state: user.profile?.state || '',
    country: user.profile?.country || '',
    zip_code: user.profile?.zip_code || '', // Use zip_code consistently throughout the application
    website: user.affiliate_profile?.website || '',
    social_media: user.affiliate_profile?.social_media || '',
    niche: user.affiliate_profile?.niche || '',
    paypal_email: user.affiliate_profile?.paypal_email || '',
    bank_account: user.affiliate_profile?.bank_account || '',
  };

  return (
    <MainLayout showSidebar userRole="affiliate" pageTitle="Affiliate Settings">
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Affiliate Settings</CardTitle>
            <CardDescription>
              Manage your account and affiliate profile. Complete all fields to access the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AccountSettingsForm
              userType="affiliate"
              initialData={initialData}
              onSubmit={handleUpdateProfile}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AffiliateSettings;
