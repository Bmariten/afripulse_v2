import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import ErrorBoundary from "./components/shared/ErrorBoundary";

// Import pages
import Index from "./pages/Index";
import ProductsPage from "./pages/ProductsPage";
import CategoryOrProductRouter from "./components/routing/CategoryOrProductRouter";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";

// Legal and Informational Pages
import TermsOfService from "./pages/legal/TermsOfService";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import RefundPolicy from "./pages/legal/RefundPolicy";
import CookiePolicy from "./pages/legal/CookiePolicy";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import SellerResources from "./pages/seller/SellerResources";
import AffiliateResources from "./pages/affiliate/AffiliateResources";

// Create a new QueryClient
const queryClient = new QueryClient();

const AppNew: React.FC = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <CartProvider>
              <TooltipProvider>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/products" element={<ProductsPage />} />
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
};

export default AppNew;
