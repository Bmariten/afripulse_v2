import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  const params = new URLSearchParams(location.search);
  const token = params.get('token');
  const verified = params.get('verified');
  const error = params.get('error');
  const role = params.get('role') || localStorage.getItem('intendedRole') || 'customer';

  useEffect(() => {
    if (token) {
      // Only call backend if token is present
      fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/verify-email?token=${token}`)
        .then(res => {
          if (res.ok) {
            setStatus('success');
            setMessage('Your email has been verified! Redirecting you...');
            setTimeout(() => {
              navigate(`/${role}/login`, { replace: true });
            }, 2200);
          } else {
            setStatus('error');
            setMessage('Invalid or expired verification link.');
          }
        })
        .catch(() => {
          setStatus('error');
          setMessage('Invalid or expired verification link.');
        });
    } else if (verified) {
      setStatus('success');
      setMessage('Your email has already been verified! You can now log in.');
      setTimeout(() => {
        navigate(`/${role}/login`, { replace: true });
      }, 2200);
    } else if (error) {
      setStatus('error');
      setMessage('Invalid or expired verification link.');
    } else {
      setStatus('error');
      setMessage('No verification information found.');
    }
  }, [token, verified, error, role, navigate]);

  const handleResend = () => {
    navigate('/resend-verification');
  };

  // Get the appropriate gradient based on role and status
  const getGradient = () => {
    if (status === "error") return "from-red-50 to-rose-100";
    
    switch (role) {
      case "seller": return "from-blue-50 to-indigo-100";
      case "affiliate": return "from-green-50 to-emerald-100";
      case "admin": return "from-purple-50 to-violet-100";
      default: return "from-blue-50 to-indigo-100";
    }
  };

  // Get the appropriate icon color based on role and status
  const getIconColor = () => {
    if (status === "error") return "text-red-600";
    if (status === "loading") return "text-amber-600";
    
    switch (role) {
      case "seller": return "text-blue-600";
      case "affiliate": return "text-green-600";
      case "admin": return "text-purple-600";
      default: return "text-blue-600";
    }
  };

  // Get the appropriate button color based on role and status
  const getButtonClass = () => {
    if (status === "error") return "bg-red-600 hover:bg-red-700";
    
    switch (role) {
      case "seller": return "bg-blue-600 hover:bg-blue-700";
      case "affiliate": return "bg-green-600 hover:bg-green-700";
      case "admin": return "bg-purple-600 hover:bg-purple-700";
      default: return "bg-blue-600 hover:bg-blue-700";
    }
  };

  return (
    <MainLayout>
      <div className={`min-h-[80vh] flex items-center justify-center p-4 bg-gradient-to-br ${getGradient()}`}>
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardContent className="pt-6 pb-4 text-center">
            <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-white shadow-sm">
              {status === 'loading' && (
                <Loader2 className={`h-10 w-10 ${getIconColor()} animate-spin`} />
              )}
              {status === 'success' && (
                <CheckCircle className={`h-10 w-10 ${getIconColor()}`} />
              )}
              {status === 'error' && (
                <AlertTriangle className={`h-10 w-10 ${getIconColor()}`} />
              )}
            </div>
            
            <h2 className="text-2xl font-bold mb-3">
              {status === 'loading' ? 'Verifying Your Email...' : 
               status === 'success' ? 'Email Verified!' : 
               'Verification Failed'}
            </h2>
            
            <p className="text-gray-600 mb-6">{message}</p>
          </CardContent>
          
          <CardFooter className="flex justify-center pb-6">
            {status === 'error' && (
              <Button 
                onClick={handleResend} 
                className={`${getButtonClass()} text-white`}
              >
                Resend Verification Email
              </Button>
            )}
            {status === 'success' && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Redirecting to login...</span>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AuthCallback;
