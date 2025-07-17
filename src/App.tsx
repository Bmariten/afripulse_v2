import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import CategoryOrProductRouter from "./components/routing/CategoryOrProductRouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import ErrorBoundary from "./components/shared/ErrorBoundary";
import Index from "./pages/Index";
import ProductsPage from "./pages/ProductsPage";
import ProductDetail from "./pages/ProductDetail";
import SellerDashboard from "./pages/SellerDashboard";
import SellerProducts from "./pages/SellerProducts";
import SellerInsights from "./pages/SellerInsights";
import SellerProfile from "./pages/SellerProfile";
import AffiliateDashboard from "./pages/AffiliateDashboard";
import AffiliateProfile from "./pages/AffiliateProfile";
import AffiliateProducts from "./pages/AffiliateProducts";
import AffiliateAnalytics from "./pages/AffiliateAnalytics";
import AffiliateLinks from "./pages/AffiliateLinks";
import SellerSettings from "./pages/settings/SellerSettings";
import AffiliateSettings from "./pages/settings/AffiliateSettings";
import AdminSettings from "./pages/settings/AdminSettings";
import NotFound from "./pages/NotFound";
import SellerAuth from "./pages/auth/SellerAuth";
import EmailConfirmed from "./pages/auth/EmailConfirmed";
import AuthCallback from "./pages/auth/AuthCallback";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import VerifyEmailSuccessPage from "./pages/auth/VerifyEmailSuccessPage";
import VerifyEmailErrorPage from "./pages/auth/VerifyEmailErrorPage";
import AuthIndex from "./pages/auth/index";
import EmailVerificationProgress from "./pages/auth/EmailVerificationProgress";
import AffiliateAuth from "./pages/auth/AffiliateAuth";
import AdminAuth from "./pages/auth/AdminAuth";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminAffiliates from "./pages/AdminAffiliates";
import AdminFlagged from "./pages/AdminFlagged";
import AdminFlaggedDetails from "./pages/AdminFlaggedDetails";
import AdminUsers from "./pages/AdminUsers";
import AdminReports from "./pages/AdminReports";
import AffiliateGenerateLink from "./pages/AffiliateGenerateLink";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import TermsOfService from "./pages/legal/TermsOfService";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import RefundPolicy from "./pages/legal/RefundPolicy";
import CookiePolicy from "./pages/legal/CookiePolicy";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import SellerResources from "./pages/seller/SellerResources";
import AffiliateResources from "./pages/affiliate/AffiliateResources";
import { useEffect } from "react";
import { useLocation, useSearchParams, Outlet } from "react-router-dom";
import api from "./services/api";
import { useAuth } from "./contexts/AuthContext";
import { isProfileComplete } from "./utils/profile";

// Create a new QueryClient
const queryClient = new QueryClient();

// Component to handle affiliate link tracking
const AffiliateTracker = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  useEffect(() => {
    const trackAffiliateClick = async () => {
      const affiliateCode = searchParams.get('aff');
      
      if (affiliateCode) {
        try {
          const response = await api.post(`/affiliate/track-click`, { code: affiliateCode });
          const data = response.data;
          // Store the affiliate code in localStorage for attribution during checkout
          if (data?.productId) {
            localStorage.setItem(`aff_${data.productId}`, affiliateCode);
          }
        } catch (error) {
          console.error('Failed to track affiliate click:', error);
        }
      }
    };

    trackAffiliateClick();
  }, [location.search]);

  return null;
};

const RequireAuth = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. Wait until the authentication status is resolved.
  if (loading) {
    return <div>Loading session...</div>; // Or a more sophisticated spinner
  }

  // 2. If loading is done and there's no user, redirect to the appropriate login page.
  if (!user) {
    // Use path to determine appropriate login route
    const path = location.pathname;
    if (path.startsWith('/seller')) {
      return <Navigate to="/seller/login" state={{ from: location }} replace />;
    } else if (path.startsWith('/affiliate')) {
      return <Navigate to="/affiliate/login" state={{ from: location }} replace />;
    } else if (path.startsWith('/admin')) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    // Default to seller login if path doesn't match any specific role
    return <Navigate to="/seller/login" state={{ from: location }} replace />;
  }

  // 3. Check if the user's role is permitted for this route.
  if (!allowedRoles.includes(user.role)) {
    // Redirect to a generic 'unauthorized' page or their specific dashboard.
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  // 4. Profile completion check is disabled to allow free navigation.
  // if (!isProfileComplete(user)) {
  //   const settingsPath = `/${user.role}/settings`;
  //   if (location.pathname === settingsPath) {
  //     return <Outlet />;
  //   }
  //   return <Navigate to={settingsPath} replace />;
  // }

  // 5. If all checks pass, render the requested page.
  return <Outlet />;
};

const App = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <CartProvider>
              <TooltipProvider>
                <AffiliateTracker />
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/products" element={<ProductsPage />} />
                  {/* Handle both category view and product detail with the same route pattern */}
                  <Route path="/products/:categoryOrProductId" element={<CategoryOrProductRouter />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-confirmation" element={<OrderConfirmation />} />
                  
                  {/* Legal and Informational Pages */}
                  <Route path="/legal/TermsOfService" element={<TermsOfService />} />
                  <Route path="/legal/PrivacyPolicy" element={<PrivacyPolicy />} />
                  <Route path="/legal/RefundPolicy" element={<RefundPolicy />} />
                  <Route path="/legal/CookiePolicy" element={<CookiePolicy />} />
                  <Route path="/AboutUs" element={<AboutUs />} />
                  <Route path="/Contact" element={<Contact />} />
                  <Route path="/seller/SellerResources" element={<SellerResources />} />
                  <Route path="/affiliate/AffiliateResources" element={<AffiliateResources />} />

                  {/* --- Authentication Routes (Public) --- */}
                  <Route path="/auth/*" element={<AuthIndex />} />
                  {/* Seller Auth */}
                  <Route path="/seller/login" element={<SellerAuth type="login" />} />
                  <Route path="/seller/signup" element={<SellerAuth type="signup" />} />
                  <Route path="/seller/email-confirmed" element={<EmailConfirmed />} />
                  {/* Affiliate Auth */}
                  <Route path="/affiliate/login" element={<AffiliateAuth type="login" />} />
                  <Route path="/affiliate/signup" element={<AffiliateAuth type="signup" />} />
                  <Route path="/affiliate/email-confirmed" element={<EmailConfirmed />} />
                  {/* Admin Auth */}
                  <Route path="/admin/login" element={<AdminAuth type="login" />} />
                  <Route path="/admin/email-confirmed" element={<EmailConfirmed />} />

                  {/* --- Protected Routes --- */}
                  {/* Protected Seller Routes */}
                  <Route element={<RequireAuth allowedRoles={['seller']} />}>
                    <Route path="/seller/dashboard" element={<SellerDashboard />} />
                    <Route path="/seller/profile" element={<SellerProfile />} />
                    <Route path="/seller/products" element={<SellerProducts />} />
                    <Route path="/seller/insights" element={<SellerInsights />} />
                    <Route path="/seller/settings" element={<SellerSettings />} />
                  </Route>

                  {/* Protected Affiliate Routes */}
                  <Route element={<RequireAuth allowedRoles={['affiliate']} />}>
                    <Route path="/affiliate/dashboard" element={<AffiliateDashboard />} />
                    <Route path="/affiliate/profile" element={<AffiliateProfile />} />
                    <Route path="/affiliate/products" element={<AffiliateProducts />} />
                    <Route path="/affiliate/analytics" element={<AffiliateAnalytics />} />
                    <Route path="/affiliate/links" element={<AffiliateLinks />} />
                    <Route path="/affiliate/generate-link" element={<AffiliateGenerateLink />} />
                    <Route path="/affiliate/settings" element={<AffiliateSettings />} />
                  </Route>

                  {/* Protected Admin Routes */}
                  <Route element={<RequireAuth allowedRoles={['admin']} />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/products" element={<AdminProducts />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="/admin/reports" element={<AdminReports />} />
                    <Route path="/admin/affiliates" element={<AdminAffiliates />} />
                    <Route path="/admin/flagged" element={<AdminFlagged />} />
                    <Route path="/admin/flagged/:id" element={<AdminFlaggedDetails />} />
                    <Route path="/admin/settings" element={<AdminSettings />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
                <Sonner />
              </TooltipProvider>
            </CartProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
