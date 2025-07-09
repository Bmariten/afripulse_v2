import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { MailCheck } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { verifyEmail } from "@/services/authService";

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

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <MailCheck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">{status === "success" ? "Email Verified!" : status === "error" ? "Verification Failed" : "Verifying..."}</h1>
          <p className="text-gray-600 mb-6">{message}</p>
          <ProgressBar value={progress} className="mb-6" />
          {status === "success" && (
            <Button onClick={handleRedirect} className="mt-4">Go to Login</Button>
          )}
        </div>
        {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={400} />}
      </div>
    </MainLayout>
  );
};

export default EmailVerificationProgress;
