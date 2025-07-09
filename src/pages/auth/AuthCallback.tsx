import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

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

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        {status === 'loading' && (
          <>
            <h2 className="text-2xl font-bold mb-4">Verifying your email...</h2>
            <p className="text-gray-600">Please wait while we complete your account setup.</p>
          </>
        )}
        {status === 'success' && (
          <>
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'green' }}>Email Verified!</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}
        {status === 'error' && (
          <>
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'red' }}>Verification Failed</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button onClick={handleResend} className="bg-primary text-white px-4 py-2 rounded">Resend Verification Email</button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
