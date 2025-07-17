import React from 'react';
import LegalPageLayout from '@/components/layout/LegalPageLayout';

const RefundPolicy: React.FC = () => {
  return (
    <LegalPageLayout title="Refund Policy">
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
        <p className="mb-4">
          At AfriPulse GMC, we want to ensure your satisfaction with every purchase. This Refund Policy outlines 
          the terms and conditions for returns and refunds on our platform.
        </p>
        <p className="mb-4">
          Please note that as a marketplace, AfriPulse GMC facilitates transactions between buyers and sellers. 
          While we have general refund guidelines, individual sellers may have specific policies that apply to their products.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Eligibility for Refunds</h2>
        <p className="mb-4">You may be eligible for a refund in the following situations:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>The product received is significantly different from what was described</li>
          <li>The product is damaged or defective upon arrival</li>
          <li>The product was not delivered within the specified timeframe</li>
          <li>You received an incorrect product</li>
          <li>Digital products that cannot be accessed or downloaded due to technical issues on our end</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Refund Process</h2>
        <p className="mb-4">To request a refund, please follow these steps:</p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Contact our customer service team within 14 days of receiving the product</li>
          <li>Provide your order number, the reason for the refund request, and supporting documentation (such as photos of damaged items)</li>
          <li>Our team will review your request and may contact the seller for additional information</li>
          <li>If approved, refunds will typically be processed within 5-7 business days</li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Return Shipping</h2>
        <p className="mb-4">
          If a return is required, please follow these guidelines:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Do not return any product without first receiving authorization from our customer service team</li>
          <li>Return the product in its original packaging with all accessories and documentation</li>
          <li>Include a copy of the return authorization in the package</li>
          <li>Use a trackable shipping method and keep the tracking information until the refund is processed</li>
        </ul>
        <p className="mt-4">
          Return shipping costs are handled as follows:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>If the return is due to our error or a defective product, we will cover the return shipping costs</li>
          <li>If the return is for any other reason, you may be responsible for the return shipping costs</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Refund Methods</h2>
        <p className="mb-4">
          Refunds will be issued using the original payment method when possible:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Credit/debit card payments will be refunded to the original card</li>
          <li>Mobile money payments will be refunded to the original account</li>
          <li>Bank transfers will be refunded to the originating account</li>
        </ul>
        <p className="mt-4">
          Please note that it may take 5-10 business days for the refund to appear in your account, depending on your 
          financial institution's processing times.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Non-Refundable Items</h2>
        <p className="mb-4">
          The following items are generally not eligible for refunds:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Digital products that have been downloaded or accessed (unless they are defective)</li>
          <li>Personalized or custom-made items (unless they are defective)</li>
          <li>Products that have been used, damaged, or altered after delivery</li>
          <li>Products returned more than 14 days after delivery</li>
          <li>Products marked as non-refundable in their description</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Seller-Specific Policies</h2>
        <p className="mb-4">
          Individual sellers on our platform may have specific refund policies that differ from our general guidelines. 
          These policies will be clearly displayed on the seller's profile and product listings. In case of any conflict, 
          the seller's specific policy will take precedence.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Dispute Resolution</h2>
        <p className="mb-4">
          If you are not satisfied with the resolution of your refund request, you may contact our customer service team 
          to escalate the issue. We are committed to fair and transparent resolution of all customer concerns.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
        <p className="mb-4">
          For any questions or concerns about our Refund Policy, please contact our customer service team:
        </p>
        <p className="mb-4">
          Email: support@afripulsegmc.com<br />
          Phone: +234 123 456 7890<br />
          Customer Service Hours: Monday-Friday, 9:00 AM - 5:00 PM WAT
        </p>
      </section>

      <div className="text-sm text-gray-500 mt-12 pt-4 border-t">
        Last updated: July 2025
      </div>
    </LegalPageLayout>
  );
};

export default RefundPolicy;
