import React from 'react';
import LegalPageLayout from '@/components/layout/LegalPageLayout';

const TermsOfService: React.FC = () => {
  return (
    <LegalPageLayout title="Terms of Service">
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
        <p className="mb-4">
          Welcome to AfriPulse GMC. These Terms of Service govern your use of our website and services. 
          By accessing or using our platform, you agree to be bound by these Terms.
        </p>
        <p className="mb-4">
          AfriPulse GMC is a marketplace connecting sellers of health & wellness and real estate products with customers and affiliates.
          Our platform allows sellers to list their products, customers to purchase them, and affiliates to promote them.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Definitions</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>"Platform"</strong> refers to the AfriPulse GMC website and services.</li>
          <li><strong>"User"</strong> refers to any individual who accesses or uses our Platform.</li>
          <li><strong>"Seller"</strong> refers to users who list and sell products on our Platform.</li>
          <li><strong>"Affiliate"</strong> refers to users who promote products on our Platform in exchange for commission.</li>
          <li><strong>"Customer"</strong> refers to users who purchase products on our Platform.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Account Registration</h2>
        <p className="mb-4">
          To access certain features of our Platform, you may need to register for an account. You agree to provide accurate, 
          current, and complete information during the registration process and to update such information to keep it accurate, 
          current, and complete.
        </p>
        <p className="mb-4">
          You are responsible for safeguarding your password and for all activities that occur under your account. You agree to 
          notify us immediately of any unauthorized use of your account.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Seller Terms</h2>
        <p className="mb-4">
          Sellers are responsible for the accuracy of their product listings, including descriptions, images, and pricing. 
          Sellers must ensure that their products comply with all applicable laws and regulations.
        </p>
        <p className="mb-4">
          AfriPulse GMC reserves the right to remove any product listings that violate our policies or applicable laws.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Affiliate Terms</h2>
        <p className="mb-4">
          Affiliates may promote products listed on our Platform in exchange for commission. Affiliates must accurately 
          represent the products they promote and disclose their affiliate relationship in accordance with applicable laws.
        </p>
        <p className="mb-4">
          Commission rates are set by sellers and may vary by product. AfriPulse GMC reserves the right to modify commission 
          structures with notice to affiliates.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Customer Terms</h2>
        <p className="mb-4">
          Customers may purchase products through our Platform. By making a purchase, customers agree to pay the listed price 
          and any applicable taxes and shipping fees.
        </p>
        <p className="mb-4">
          AfriPulse GMC is not responsible for the quality, safety, or legality of products sold on our Platform. However, 
          we strive to ensure a safe and satisfactory shopping experience for all users.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
        <p className="mb-4">
          The content, organization, graphics, design, and other matters related to our Platform are protected by applicable 
          copyrights, trademarks, and other proprietary rights. Users may not copy, modify, or distribute any content from our 
          Platform without prior written permission.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
        <p className="mb-4">
          AfriPulse GMC is not liable for any indirect, incidental, special, consequential, or punitive damages arising out of 
          or relating to your use of our Platform.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
        <p className="mb-4">
          AfriPulse GMC reserves the right to modify these Terms at any time. We will notify users of significant changes by 
          posting a notice on our Platform or sending an email.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
        <p className="mb-4">
          If you have any questions about these Terms, please contact us at support@afripulsegmc.com.
        </p>
      </section>

      <div className="text-sm text-gray-500 mt-12 pt-4 border-t">
        Last updated: July 2025
      </div>
    </LegalPageLayout>
  );
};

export default TermsOfService;
