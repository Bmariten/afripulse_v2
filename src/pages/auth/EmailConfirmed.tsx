import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { useToast } from "@/components/ui/use-toast";

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

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="mb-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-4">Email Confirmed!</h1>
          <p className="text-gray-600 mb-8">Your email address has been successfully confirmed. You will be redirected to the login page shortly.</p>
          <Button onClick={() => navigate(`/${userType}/login`, { replace: true })}>
            Go to Login
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default EmailConfirmed;
