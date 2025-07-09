import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const VerifyEmailSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const role = params.get('role');

  const handleLogin = () => {
    let loginPath = '/seller/login';
    if (role === 'seller') loginPath = '/seller/login';
    else if (role === 'affiliate') loginPath = '/affiliate/login';
    else if (role === 'admin') loginPath = '/admin/login';
    navigate(loginPath);
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4 text-green-600">Email Verified!</h2>
        <p className="text-gray-700 mb-6">
          Your email has been successfully verified. You can now log in to your account.
        </p>
        <Button onClick={handleLogin} className="bg-primary text-white px-4 py-2 rounded">
          Go to Login
        </Button>
      </div>
    </div>
  );
};

export default VerifyEmailSuccessPage;
