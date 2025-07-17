import React from 'react';
import LegalPageLayout from '@/components/layout/LegalPageLayout';

const PrivacyPolicy: React.FC = () => {
  return (
    <LegalPageLayout title="Privacy Policy">
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
        <p className="mb-4">
          At AfriPulse GMC, we respect your privacy and are committed to protecting your personal data. 
          This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform.
        </p>
        <p className="mb-4">
          By using our platform, you consent to the collection and use of information in accordance with this policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
        <p className="mb-4">We collect several types of information from and about users of our platform, including:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Personal Information:</strong> Name, email address, postal address, phone number, and payment information.</li>
          <li><strong>Profile Information:</strong> For sellers and affiliates, we collect business information, website URLs, social media handles, and banking details for payments.</li>
          <li><strong>Transaction Information:</strong> Details about purchases or sales made through our platform.</li>
          <li><strong>Usage Information:</strong> How you interact with our platform, including browsing behavior and search queries.</li>
          <li><strong>Device Information:</strong> IP address, browser type, operating system, and other technical information.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
        <p className="mb-4">We use the information we collect to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide, operate, and maintain our platform</li>
          <li>Process transactions and send related information</li>
          <li>Verify user identity and prevent fraud</li>
          <li>Manage user accounts</li>
          <li>Send administrative emails and notifications</li>
          <li>Respond to comments, questions, and customer service requests</li>
          <li>Send marketing communications (with your consent)</li>
          <li>Improve our platform and user experience</li>
          <li>Analyze usage patterns and trends</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Information Sharing</h2>
        <p className="mb-4">We may share your information with:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Sellers and Customers:</strong> To facilitate transactions between users.</li>
          <li><strong>Affiliates:</strong> When you purchase through an affiliate link, the affiliate may receive information about the transaction.</li>
          <li><strong>Service Providers:</strong> Third-party companies that perform services on our behalf, such as payment processing, data analysis, and customer service.</li>
          <li><strong>Legal Authorities:</strong> When required by law or to protect our rights and safety.</li>
        </ul>
        <p className="mt-4">
          We do not sell your personal information to third parties for marketing purposes.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
        <p className="mb-4">
          We implement appropriate security measures to protect your personal information from unauthorized access, 
          alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic 
          storage is 100% secure, and we cannot guarantee absolute security.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
        <p className="mb-4">Depending on your location, you may have the following rights:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Access the personal information we hold about you</li>
          <li>Correct inaccurate or incomplete information</li>
          <li>Request deletion of your personal information</li>
          <li>Object to or restrict the processing of your information</li>
          <li>Data portability (receiving your data in a structured, machine-readable format)</li>
          <li>Withdraw consent at any time (where processing is based on consent)</li>
        </ul>
        <p className="mt-4">
          To exercise these rights, please contact us using the information provided in the "Contact Us" section.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Cookies and Tracking Technologies</h2>
        <p className="mb-4">
          We use cookies and similar tracking technologies to collect information about your browsing activities 
          and to improve your experience on our platform. You can control cookies through your browser settings, 
          but disabling cookies may limit your ability to use some features of our platform.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
        <p className="mb-4">
          Our platform is not intended for children under 16 years of age. We do not knowingly collect personal 
          information from children under 16. If you are a parent or guardian and believe your child has provided 
          us with personal information, please contact us.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">9. Changes to This Privacy Policy</h2>
        <p className="mb-4">
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the 
          new Privacy Policy on this page and updating the "Last updated" date.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <p className="mb-4">
          Email: privacy@afripulsegmc.com<br />
          Address: AfriPulse GMC Headquarters, 123 Business Avenue, Suite 456, Lagos, Nigeria
        </p>
      </section>

      <div className="text-sm text-gray-500 mt-12 pt-4 border-t">
        Last updated: July 2025
      </div>
    </LegalPageLayout>
  );
};

export default PrivacyPolicy;
