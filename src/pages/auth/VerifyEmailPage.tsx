import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MailCheck } from 'lucide-react';

const VerifyEmailPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <MailCheck className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              We've sent a confirmation link to your email address. 
              Please click the link in the email to complete your registration and verify your account.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default VerifyEmailPage; // Make sure this is imported and routed in App.tsx for /auth/check-email
