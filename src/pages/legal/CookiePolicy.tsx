import React from 'react';
import LegalPageLayout from '@/components/layout/LegalPageLayout';

const CookiePolicy: React.FC = () => {
  return (
    <LegalPageLayout title="Cookie Policy">
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
        <p className="mb-4">
          This Cookie Policy explains how AfriPulse GMC uses cookies and similar technologies to recognize you when you visit our platform. 
          It explains what these technologies are and why we use them, as well as your rights to control our use of them.
        </p>
        <p className="mb-4">
          By continuing to use our platform, you are agreeing to our use of cookies as described in this Cookie Policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. What Are Cookies?</h2>
        <p className="mb-4">
          Cookies are small data files that are placed on your computer or mobile device when you visit a website. 
          They are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.
        </p>
        <p className="mb-4">
          Cookies set by the website owner (in this case, AfriPulse GMC) are called "first-party cookies." 
          Cookies set by parties other than the website owner are called "third-party cookies." 
          Third-party cookies enable third-party features or functionality to be provided on or through the website 
          (e.g., advertising, interactive content, and analytics).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>
        <p className="mb-4">We use the following types of cookies:</p>
        
        <h3 className="text-xl font-semibold mb-2">Essential Cookies</h3>
        <p className="mb-4">
          These cookies are necessary for the website to function and cannot be switched off in our systems. 
          They are usually only set in response to actions made by you which amount to a request for services, 
          such as setting your privacy preferences, logging in, or filling in forms.
        </p>
        
        <h3 className="text-xl font-semibold mb-2">Performance and Analytics Cookies</h3>
        <p className="mb-4">
          These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. 
          They help us to know which pages are the most and least popular and see how visitors move around the site.
        </p>
        
        <h3 className="text-xl font-semibold mb-2">Functionality Cookies</h3>
        <p className="mb-4">
          These cookies enable the website to provide enhanced functionality and personalization. 
          They may be set by us or by third-party providers whose services we have added to our pages.
        </p>
        
        <h3 className="text-xl font-semibold mb-2">Targeting Cookies</h3>
        <p className="mb-4">
          These cookies may be set through our site by our advertising partners. 
          They may be used by those companies to build a profile of your interests and show you relevant advertisements on other sites.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Specific Cookies We Use</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b border-r">Cookie Name</th>
                <th className="py-2 px-4 border-b border-r">Purpose</th>
                <th className="py-2 px-4 border-b border-r">Duration</th>
                <th className="py-2 px-4 border-b">Type</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b border-r">session_id</td>
                <td className="py-2 px-4 border-b border-r">Maintains your session state</td>
                <td className="py-2 px-4 border-b border-r">Session</td>
                <td className="py-2 px-4 border-b">Essential</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b border-r">auth_token</td>
                <td className="py-2 px-4 border-b border-r">Keeps you logged in</td>
                <td className="py-2 px-4 border-b border-r">30 days</td>
                <td className="py-2 px-4 border-b">Essential</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b border-r">_ga</td>
                <td className="py-2 px-4 border-b border-r">Google Analytics tracking</td>
                <td className="py-2 px-4 border-b border-r">2 years</td>
                <td className="py-2 px-4 border-b">Analytics</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b border-r">_gid</td>
                <td className="py-2 px-4 border-b border-r">Google Analytics user identification</td>
                <td className="py-2 px-4 border-b border-r">24 hours</td>
                <td className="py-2 px-4 border-b">Analytics</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b border-r">preferences</td>
                <td className="py-2 px-4 border-b border-r">Stores user preferences</td>
                <td className="py-2 px-4 border-b border-r">1 year</td>
                <td className="py-2 px-4 border-b">Functionality</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. How to Control Cookies</h2>
        <p className="mb-4">
          You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, 
          you may still use our website though your access to some functionality and areas of our website may be restricted.
        </p>
        <p className="mb-4">
          The specific way to manage cookies varies by browser. Please refer to your browser's help menu for instructions:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Google Chrome</li>
          <li>Mozilla Firefox</li>
          <li>Microsoft Edge</li>
          <li>Safari</li>
          <li>Opera</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Do Not Track</h2>
        <p className="mb-4">
          Some browsers have a "Do Not Track" feature that signals to websites that you visit that you do not want to have your 
          online activity tracked. Our website does not currently respond to "Do Not Track" signals.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Changes to This Cookie Policy</h2>
        <p className="mb-4">
          We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our business practices. 
          Any changes will become effective when we post the revised Cookie Policy on our website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
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

export default CookiePolicy;
