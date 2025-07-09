import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AccountSettingsForm } from '@/components/settings/AccountSettingsForm';
import MainLayout from '@/components/layout/MainLayout';
import { useEffect } from 'react';
import api from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { User, Profile, SellerProfile } from '@/services/authService';
import { isProfileComplete as checkProfileCompleteness } from '@/utils/profile';

const SellerSettings = () => {
  const { user, loading, updateUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'seller')) {
      toast({ title: "Unauthorized", description: "You must be logged in as a seller to view this page.", variant: "destructive" });
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate, toast]);

  const handleUpdateProfile = async (data: Partial<Profile & SellerProfile>) => {
    try {
      // First update general profile information
      const profilePayload = {
        profile: {
          name: data.name,
          phone: data.phone,
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
          zip_code: data.zip_code,
        }
      };

      // Update general profile
      await api.put('/profile/me', profilePayload);
      
      // Then update seller-specific information
      const sellerPayload = {
        business_name: data.business_name,
        business_description: data.business_description,
        business_address: data.business_address,
        business_city: data.business_city,
        business_state: data.business_state,
        business_country: data.business_country,
        business_zip_code: data.business_zip_code,
        business_phone: data.business_phone,
        business_email: data.business_email,
        paypal_email: data.paypal_email,
        bank_account: data.bank_account,
      };

      // Update seller profile
      await api.put('/sellers/profile', sellerPayload);
      
      // Fetch the updated user data
      const response = await api.get('/profile/me');
      const updatedUser = response.data;
      updateUser(updatedUser);

      toast({
        title: "Settings updated",
        description: "Your profile has been successfully updated.",
      });

      if (checkProfileCompleteness(updatedUser)) {
        navigate('/seller/dashboard', { replace: true });
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
    // Base profile data
    name: user.profile?.name || '',
    phone: user.profile?.phone || '',
    address: user.profile?.address || '',
    city: user.profile?.city || '',
    state: user.profile?.state || '',
    country: user.profile?.country || '',
    zip_code: user.profile?.zip_code || '',

    // Seller profile data
    business_name: user.seller_profile?.business_name || '',
    business_description: user.seller_profile?.business_description || '',
    business_address: user.seller_profile?.business_address || '',
    business_city: user.seller_profile?.business_city || '',
    business_state: user.seller_profile?.business_state || '',
    business_country: user.seller_profile?.business_country || '',
    business_zip_code: user.seller_profile?.business_zip_code || '',
    business_phone: user.seller_profile?.business_phone || '',
    business_email: user.seller_profile?.business_email || '',
    paypal_email: user.seller_profile?.paypal_email || '',
    bank_account: user.seller_profile?.bank_account || '',
  };

  return (
    <MainLayout showSidebar userRole="seller" pageTitle="Seller Settings">
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Seller Settings</CardTitle>
            <CardDescription>
              Manage your account and business profile. Complete all fields to access the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AccountSettingsForm
              userType="seller"
              initialData={initialData}
              onSubmit={handleUpdateProfile}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default SellerSettings;
