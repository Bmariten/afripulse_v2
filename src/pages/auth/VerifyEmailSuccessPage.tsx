import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

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

  // Get the appropriate gradient based on role
  const getGradient = () => {
    switch (role) {
      case "seller": return "from-blue-50 to-indigo-100";
      case "affiliate": return "from-green-50 to-emerald-100";
      case "admin": return "from-purple-50 to-violet-100";
      default: return "from-blue-50 to-indigo-100";
    }
  };

  // Get the appropriate button class based on role
  const getButtonClass = () => {
    switch (role) {
      case "seller": return "bg-blue-600 hover:bg-blue-700";
      case "affiliate": return "bg-green-600 hover:bg-green-700";
      case "admin": return "bg-purple-600 hover:bg-purple-700";
      default: return "bg-blue-600 hover:bg-blue-700";
    }
  };

  // Get the appropriate icon color based on role
  const getIconColor = () => {
    switch (role) {
      case "seller": return "text-blue-600";
      case "affiliate": return "text-green-600";
      case "admin": return "text-purple-600";
      default: return "text-blue-600";
    }
  };

  return (
    <MainLayout>
      <div className={`min-h-[80vh] flex items-center justify-center p-4 bg-gradient-to-br ${getGradient()}`}>
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardContent className="pt-6 pb-4 text-center">
            <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-white shadow-sm">
              <CheckCircle className={`h-10 w-10 ${getIconColor()}`} />
            </div>
            
            <h2 className="text-2xl font-bold mb-3">Email Verified!</h2>
            
            <p className="text-gray-700 mb-6">
              Your email has been successfully verified. You can now log in to your account and start using all features.
            </p>
          </CardContent>
          
          <CardFooter className="flex justify-center pb-6">
            <Button 
              onClick={handleLogin} 
              className={`${getButtonClass()} text-white px-8 py-2`}
            >
              Go to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default VerifyEmailSuccessPage;
