import { Navigate, useSearchParams } from "react-router-dom";
import EmailVerificationProgress from "./EmailVerificationProgress";

const AuthIndex = () => {
  const [searchParams] = useSearchParams();
  // If URL contains token, show verification progress page
  if (searchParams.get("token")) {
    return <EmailVerificationProgress />;
  }
  // Otherwise, redirect to login or default auth page
  return <Navigate to="/seller/login" />;
};

export default AuthIndex;
