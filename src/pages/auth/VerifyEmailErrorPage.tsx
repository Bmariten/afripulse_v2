import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const VerifyEmailErrorPage: React.FC = () => {
  const navigate = useNavigate();

  const handleResend = () => {
    navigate('/resend-verification');
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Verification Failed</h2>
        <p className="text-gray-700 mb-6">
          This verification link is invalid or has already been used.<br />
          If you need a new verification email, click below.
        </p>
        <Button onClick={handleResend} className="bg-primary text-white px-4 py-2 rounded">
          Resend Verification Email
        </Button>
      </div>
    </div>
  );
};

export default VerifyEmailErrorPage;
