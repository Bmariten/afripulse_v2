import React from 'react';
import MainLayout from '@/components/layout/MainLayout';

const SimpleTerms: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <div className="prose max-w-none">
          <p>
            Welcome to AfriPulse GMC. These Terms of Service govern your use of our website and services.
          </p>
          <p>
            By accessing or using our platform, you agree to be bound by these Terms.
          </p>
          <h2 className="text-xl font-semibold mt-6 mb-3">1. Introduction</h2>
          <p>
            AfriPulse GMC is a marketplace connecting sellers of health & wellness and real estate products with customers and affiliates.
            Our platform allows sellers to list their products, customers to purchase them, and affiliates to promote them.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default SimpleTerms;
