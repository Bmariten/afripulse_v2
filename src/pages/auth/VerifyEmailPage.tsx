import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { MailCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const userType = searchParams.get("role") || "seller";
  const email = searchParams.get("email") || "your email";

  // Get the appropriate gradient based on user type
  const getGradient = () => {
    switch (userType) {
      case "seller": return "from-blue-50 to-indigo-100";
      case "affiliate": return "from-green-50 to-emerald-100";
      case "admin": return "from-purple-50 to-violet-100";
      default: return "from-blue-50 to-indigo-100";
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
          <CardHeader className="text-center pt-6">
            <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-white shadow-sm">
              <MailCheck className={`h-10 w-10 ${getIconColor()}`} />
            </div>
            <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
          </CardHeader>
          <CardContent className="text-center pb-4">
            <p className="text-gray-600 mb-4">
              We've sent a confirmation link to <span className="font-medium">{email}</span>
            </p>
            <p className="text-gray-600">
              Please click the link in the email to complete your registration and verify your account.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 items-center pb-6">
            <p className="text-sm text-gray-500">Didn't receive an email?</p>
            <Button 
              variant="outline" 
              className="border-gray-300 hover:bg-gray-50"
            >
              Resend Verification Email
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default VerifyEmailPage; // Make sure this is imported and routed in App.tsx for /auth/check-email
