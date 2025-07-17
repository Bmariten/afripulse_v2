import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

const VerifyEmailErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const role = params.get('role') || 'seller';

  const handleResend = () => {
    navigate('/resend-verification');
  };
  
  const handleHome = () => {
    navigate('/');
  };

  return (
    <MainLayout>
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-rose-100">
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardContent className="pt-6 pb-4 text-center">
            <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-white shadow-sm">
              <AlertTriangle className="h-10 w-10 text-red-600" />
            </div>
            
            <h2 className="text-2xl font-bold mb-3">Verification Failed</h2>
            
            <p className="text-gray-700 mb-6">
              This verification link is invalid or has already been used.<br />
              If you need a new verification email, click below.
            </p>
          </CardContent>
          
          <CardFooter className="flex justify-center gap-4 pb-6">
            <Button 
              onClick={handleResend} 
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Resend Verification
            </Button>
            <Button 
              onClick={handleHome} 
              variant="outline" 
              className="border-red-200 text-red-700 hover:bg-red-50"
            >
              Return to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default VerifyEmailErrorPage;
