import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { MailCheck, AlertCircle, Loader2 } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { verifyEmail } from "@/services/authService";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const EmailVerificationProgress: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>("pending");
  const [role, setRole] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    let pct = 0;
    const interval = setInterval(() => {
      pct += Math.random() * 20;
      setProgress(Math.min(pct, 90));
    }, 200);
    setStatus("pending");
    setProgress(0);
    setShowConfetti(false);
    setMessage("");
    setRole(null);

    const error = searchParams.get("error");
    const verified = searchParams.get("verified");
    const token = searchParams.get("token");
    const roleParam = searchParams.get("role");

    if (verified) {
      setProgress(100);
      setStatus("success");
      setShowConfetti(true);
      setRole(roleParam ?? null);
      setMessage("Your email has been verified!");
    } else if (error) {
      setProgress(100);
      setStatus("error");
      setMessage(error === "invalid_token" ? "Invalid or missing verification token." : "Verification failed or token expired.");
    } else if (token && status === 'pending') {
            verifyEmail(token)
        .then(result => {
          setProgress(100);
          if (result.success) {
            setStatus("success");
            setShowConfetti(true);
            setRole(result.user?.role ?? null);
            setMessage("Your email has been verified!");
          } else {
            setStatus("error");
            setMessage(result.error || "Verification failed or token expired.");
          }
        });
    } else {
      setProgress(100);
      setStatus("error");
      setMessage("Missing verification token.");
      // Optionally, you can redirect to /auth/check-email here after a short delay
      // setTimeout(() => navigate('/auth/check-email'), 3000);
    }
    return () => clearInterval(interval);
  }, [searchParams]);

  const handleRedirect = () => {
    if (role === "seller") navigate("/seller/login");
    else if (role === "affiliate") navigate("/affiliate/login");
    else if (role === "admin") navigate("/admin/login");
    else navigate("/seller/login");
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
    if (status === "pending") return "text-amber-600";
    
    switch (role) {
      case "seller": return "text-blue-600";
      case "affiliate": return "text-green-600";
      case "admin": return "text-purple-600";
      default: return "text-blue-600";
    }
  };

  // Get the appropriate button color based on role
  const getButtonClass = () => {
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
              {status === "pending" && (
                <Loader2 className={`h-10 w-10 ${getIconColor()} animate-spin`} />
              )}
              {status === "success" && (
                <MailCheck className={`h-10 w-10 ${getIconColor()}`} />
              )}
              {status === "error" && (
                <AlertCircle className={`h-10 w-10 ${getIconColor()}`} />
              )}
            </div>
            
            <h1 className="text-2xl font-bold mb-3">
              {status === "success" ? "Email Verified!" : 
               status === "error" ? "Verification Failed" : 
               "Verifying Your Email..."}
            </h1>
            
            <p className="text-gray-600 mb-6">{message}</p>
            
            <ProgressBar 
              value={progress} 
              className={`mb-6 h-2 ${status === "success" ? "bg-green-100" : 
                                      status === "error" ? "bg-red-100" : 
                                      "bg-amber-100"}`} 
            />
          </CardContent>
          
          <CardFooter className="flex justify-center pb-6">
            {status === "success" && (
              <Button 
                onClick={handleRedirect} 
                className={`${getButtonClass()} text-white px-8 py-2`}
              >
                Go to Login
              </Button>
            )}
            {status === "error" && (
              <Button 
                onClick={() => navigate('/')} 
                variant="outline" 
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Return to Home
              </Button>
            )}
          </CardFooter>
        </Card>
        {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={400} />}
      </div>
    </MainLayout>
  );
};

export default EmailVerificationProgress;
