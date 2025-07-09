
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { UserRole } from '@/services/authService';

interface AuthFormProps {
  type: 'login' | 'signup';
  userType: 'seller' | 'affiliate' | 'admin';
}

const AuthForm = ({ type, userType }: AuthFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    website: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, signup, user } = useAuth(); // <-- add user here
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (type === 'login') {
      console.log(`Attempting to login as ${userType} with:`, {
        email: formData.email,
        password: formData.password
      });
      
      // Handle login
      const user = await login(formData.email, formData.password);
      if (user) {
        // Redirect based on role
        switch (user.role) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'seller':
            navigate('/seller/dashboard');
            break;
          case 'affiliate':
            navigate('/affiliate/dashboard');
            break;
          default:
            navigate('/'); // Fallback to home
        }
      } else {
        console.error("Login failed");
        toast({
          title: "Login failed",
          description: "Invalid credentials or account issue. Please try again.",
          variant: "destructive",
        });
      }
      setIsSubmitting(false);
      return;
    } else {
      // Handle signup
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Passwords don't match",
          description: "Please ensure your passwords match.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const name = userType === 'seller' ? formData.businessName : 
                  (formData.businessName || formData.email.split('@')[0]);
      
      const success = await signup({
        email: formData.email, 
        password: formData.password, 
        role: userType as UserRole, 
        name: name
      });

      if (success) {
        navigate('/auth/check-email');
      }
    }
    
    setIsSubmitting(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {type === 'login' ? 'Log In' : 'Sign Up'} as {userType}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              type="email" 
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password"
              type="password" 
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
            />
          </div>

          {type === 'signup' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword"
                  type="password" 
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                />
              </div>

              {userType === 'seller' && (
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input 
                    id="businessName"
                    type="text" 
                    placeholder="Enter your business name"
                    value={formData.businessName}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                    required
                  />
                </div>
              )}

              {userType === 'affiliate' && (
                <div className="space-y-2">
                  <Label htmlFor="website">Website/Social Media URL (Optional)</Label>
                  <Input 
                    id="website"
                    type="url" 
                    placeholder="Enter your website or social media URL"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  />
                </div>
              )}
            </>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting 
              ? (type === 'login' ? 'Logging in...' : 'Signing up...') 
              : (type === 'login' ? 'Log In' : 'Sign Up')
            }
          </Button>

          {type === 'login' && (
            <div className="text-xs text-center mt-2">
              <p className="text-gray-500">
                Use these credentials for testing:
              </p>
              <p className="text-gray-700 font-mono bg-gray-100 p-1 rounded mt-1">
                {userType}@afripulsegmc.com / {userType.charAt(0).toUpperCase() + userType.slice(1)}123!
              </p>
            </div>
          )}

          <div className="text-center text-sm">
            {type === 'login' ? (
              <>
                Don't have an account?{' '}
                <Link to={`/${userType}/signup`} className="text-primary hover:underline">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link to={`/${userType}/login`} className="text-primary hover:underline">
                  Log In
                </Link>
              </>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AuthForm;
