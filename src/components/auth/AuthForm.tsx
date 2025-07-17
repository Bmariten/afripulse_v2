
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { UserRole } from '@/services/authService';
import { Eye, EyeOff, Lock, Mail, Globe, Building2, ArrowRight } from 'lucide-react';

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
  
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (type === 'login') {
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

  // Determine the role-specific color scheme
  const getRoleColorScheme = () => {
    switch(userType) {
      case 'seller':
        return {
          gradient: 'from-blue-600 to-indigo-600',
          button: 'bg-blue-600 hover:bg-blue-700',
          lightBg: 'bg-blue-50',
          border: 'border-blue-100',
          icon: 'text-blue-500',
          link: 'text-blue-600 hover:text-blue-800'
        };
      case 'affiliate':
        return {
          gradient: 'from-green-600 to-emerald-600',
          button: 'bg-green-600 hover:bg-green-700',
          lightBg: 'bg-green-50',
          border: 'border-green-100',
          icon: 'text-green-500',
          link: 'text-green-600 hover:text-green-800'
        };
      case 'admin':
        return {
          gradient: 'from-purple-600 to-violet-600',
          button: 'bg-purple-600 hover:bg-purple-700',
          lightBg: 'bg-purple-50',
          border: 'border-purple-100',
          icon: 'text-purple-500',
          link: 'text-purple-600 hover:text-purple-800'
        };
      default:
        return {
          gradient: 'from-blue-600 to-indigo-600',
          button: 'bg-blue-600 hover:bg-blue-700',
          lightBg: 'bg-blue-50',
          border: 'border-blue-100',
          icon: 'text-blue-500',
          link: 'text-blue-600 hover:text-blue-800'
        };
    }
  };

  const colors = getRoleColorScheme();
  
  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden shadow-lg border-0">
      <div className={`bg-gradient-to-r ${colors.gradient} p-6 text-white`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            {type === 'login' ? 'Welcome Back' : 'Join AfriPulse'}
          </h2>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            {userType === 'seller' && <Building2 className="h-5 w-5" />}
            {userType === 'affiliate' && <Globe className="h-5 w-5" />}
            {userType === 'admin' && <Lock className="h-5 w-5" />}
          </div>
        </div>
        <p className="opacity-90">
          {type === 'login' 
            ? `Sign in to your ${userType} account to access your dashboard` 
            : `Create a new ${userType} account to get started`}
        </p>
      </div>
      
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">Email Address</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className={`h-5 w-5 ${colors.icon}`} />
              </div>
              <Input 
                id="email"
                type="email" 
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="pl-10 border-gray-300 focus:border-gray-400 focus:ring focus:ring-opacity-50"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              {type === 'login' && (
                <Link to="/forgot-password" className={`text-xs ${colors.link}`}>
                  Forgot password?
                </Link>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className={`h-5 w-5 ${colors.icon}`} />
              </div>
              <Input 
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={type === 'login' ? "Enter your password" : "Create a strong password"}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="pl-10 pr-10 border-gray-300 focus:border-gray-400 focus:ring focus:ring-opacity-50"
                required
              />
              <button 
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {type === 'signup' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className={`h-5 w-5 ${colors.icon}`} />
                  </div>
                  <Input 
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="pl-10 border-gray-300 focus:border-gray-400 focus:ring focus:ring-opacity-50"
                    required
                  />
                </div>
              </div>

              {userType === 'seller' && (
                <div className="space-y-2">
                  <Label htmlFor="businessName" className="text-gray-700">Business Name</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Building2 className={`h-5 w-5 ${colors.icon}`} />
                    </div>
                    <Input 
                      id="businessName"
                      type="text" 
                      placeholder="Your business name"
                      value={formData.businessName}
                      onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                      className="pl-10 border-gray-300 focus:border-gray-400 focus:ring focus:ring-opacity-50"
                      required
                    />
                  </div>
                </div>
              )}

              {userType === 'affiliate' && (
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-gray-700">Website/Social Media URL (Optional)</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Globe className={`h-5 w-5 ${colors.icon}`} />
                    </div>
                    <Input 
                      id="website"
                      type="url" 
                      placeholder="https://yourwebsite.com"
                      value={formData.website}
                      onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                      className="pl-10 border-gray-300 focus:border-gray-400 focus:ring focus:ring-opacity-50"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          <Button 
            type="submit" 
            className={`w-full ${colors.button} text-white flex items-center justify-center gap-2 py-6`} 
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? (type === 'login' ? 'Logging in...' : 'Signing up...') 
              : (
                <>
                  {type === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="h-4 w-4" />
                </>
              )
            }
          </Button>
        </form>
        
        {type === 'login' && (
          <div className={`mt-6 p-4 ${colors.lightBg} rounded-lg ${colors.border} text-sm`}>
            <p className="font-medium mb-1 text-gray-700">Test Credentials</p>
            <div className="font-mono text-xs bg-white p-2 rounded border border-gray-200 shadow-sm">
              <div><span className="text-gray-500">Email:</span> {userType}@afripulsegmc.com</div>
              <div><span className="text-gray-500">Password:</span> {userType.charAt(0).toUpperCase() + userType.slice(1)}123!</div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className={`bg-gray-50 border-t border-gray-100 flex justify-center py-4`}>
        {type === 'login' ? (
          <div className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to={`/${userType}/signup`} className={colors.link}>
              Create an account
            </Link>
          </div>
        ) : (
          <div className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to={`/${userType}/login`} className={colors.link}>
              Sign in
            </Link>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
