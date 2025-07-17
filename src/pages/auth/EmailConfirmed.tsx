import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CheckCircle, Loader2 } from "lucide-react";

const EmailConfirmed = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Optionally, get userType from query params or location state
  // Default to seller if not specified
  const params = new URLSearchParams(location.search);
  const userType = params.get("userType") || "seller";

  const { toast } = useToast();

  useEffect(() => {
    const checkAndRedirect = async () => {
      const { data: user } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/user`, { withCredentials: true });
      if (!user) {
        toast({
          title: "Please log in",
          description: "You will be redirected to the login page to complete your registration.",
          variant: "default",
        });
        setTimeout(() => {
          navigate(`/${userType}/login`, { replace: true });
        }, 2000);
        return;
      }
      // Check if profile exists
      let profile = null;
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/profiles/${user.id}`, { withCredentials: true });
        profile = response.data;
      } catch (error) {
        profile = null;
      }
      if (!profile) {
        // Redirect to profile completion form based on userType
        setTimeout(() => {
          navigate(`/settings/${userType}`, { replace: true });
        }, 1500);
        toast({
          title: "Complete your profile",
          description: "Please fill in your profile details to finish registration.",
        });
      } else {
        // Optionally, redirect to dashboard if profile exists
        setTimeout(() => {
          navigate(`/${userType}/dashboard`, { replace: true });
        }, 1500);
      }
    };
    checkAndRedirect();
  }, [userType, toast]);

  // Check authentication state for rendering
  const [user, setUser] = useState(null);
  useEffect(() => {
    const checkUser = async () => {
      const { data: user } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/user`, { withCredentials: true });
      setUser(user);
    };
    checkUser();
  }, []);

  // Get the appropriate gradient based on user type
  const getGradient = () => {
    switch (userType) {
      case "seller": return "from-blue-50 to-indigo-100";
      case "affiliate": return "from-green-50 to-emerald-100";
      case "admin": return "from-purple-50 to-violet-100";
      default: return "from-blue-50 to-indigo-100";
    }
  };

  // Get the appropriate button class based on user type
  const getButtonClass = () => {
    switch (userType) {
      case "seller": return "bg-blue-600 hover:bg-blue-700";
      case "affiliate": return "bg-green-600 hover:bg-green-700";
      case "admin": return "bg-purple-600 hover:bg-purple-700";
      default: return "bg-blue-600 hover:bg-blue-700";
    }
  };

  // Get the appropriate icon color based on user type
  const getIconColor = () => {
    switch (userType) {
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
              {user ? (
                <CheckCircle className={`h-10 w-10 ${getIconColor()}`} />
              ) : (
                <Loader2 className={`h-10 w-10 ${getIconColor()} animate-spin`} />
              )}
            </div>
            
            <h1 className="text-2xl font-bold mb-3">Email Confirmed!</h1>
            
            <p className="text-gray-600 mb-6">
              Your email address has been successfully confirmed. 
              {!user ? "Checking your account..." : "You will be redirected to complete your profile."}
            </p>
          </CardContent>
          
          <CardFooter className="flex justify-center pb-6">
            <Button 
              onClick={() => navigate(`/${userType}/login`, { replace: true })} 
              className={`${getButtonClass()} text-white px-8 py-2`}
              disabled={!user}
            >
              {!user ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking Account
                </>
              ) : (
                "Go to Login"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default EmailConfirmed;
