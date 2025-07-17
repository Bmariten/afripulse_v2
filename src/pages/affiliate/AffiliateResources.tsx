import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Link, 
  TrendingUp, 
  Share2, 
  DollarSign, 
  Users, 
  BarChart3, 
  FileText, 
  Download,
  ArrowRight
} from 'lucide-react';

const AffiliateResources: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Affiliate Resources</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to succeed as an affiliate marketer on AfriPulse GMC. 
            Access guides, tools, and resources to maximize your earnings.
          </p>
        </div>

        {/* Getting Started Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Getting Started</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Create Your Account</h3>
              <p className="text-gray-600 mb-4">
                Set up your affiliate profile with your niche, website, and social media channels to start earning.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <a href="/affiliate/signup">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </Card>

            <Card className="p-6">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Link className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Generate Links</h3>
              <p className="text-gray-600 mb-4">
                Browse our marketplace and generate unique affiliate links for products that match your audience.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <a href="/affiliate/marketplace">
                  Browse Products <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </Card>

            <Card className="p-6">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Track Performance</h3>
              <p className="text-gray-600 mb-4">
                Monitor your clicks, conversions, and earnings with our comprehensive analytics dashboard.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <a href="/affiliate/dashboard">
                  Access Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </Card>
          </div>
        </section>

        {/* Affiliate Guides */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Affiliate Marketing Guides</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <FileText className="mr-2 h-5 w-5 text-green-600" />
                Affiliate Marketing Basics
              </h3>
              <p className="text-gray-600 mb-4">
                Learn the fundamentals of affiliate marketing and how to get started with promoting products.
              </p>
              <Button variant="ghost" className="text-green-600">
                Read Guide <Download className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <FileText className="mr-2 h-5 w-5 text-green-600" />
                Social Media Promotion Strategies
              </h3>
              <p className="text-gray-600 mb-4">
                Discover effective ways to promote affiliate products on various social media platforms.
              </p>
              <Button variant="ghost" className="text-green-600">
                Read Guide <Download className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <FileText className="mr-2 h-5 w-5 text-green-600" />
                Content Creation for Affiliates
              </h3>
              <p className="text-gray-600 mb-4">
                Learn how to create engaging content that drives traffic and conversions for your affiliate links.
              </p>
              <Button variant="ghost" className="text-green-600">
                Read Guide <Download className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <FileText className="mr-2 h-5 w-5 text-green-600" />
                Email Marketing for Affiliates
              </h3>
              <p className="text-gray-600 mb-4">
                Master the art of email marketing to promote affiliate products and increase your conversion rates.
              </p>
              <Button variant="ghost" className="text-green-600">
                Read Guide <Download className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Marketing Tools */}
        <section className="mb-16 bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Marketing Tools</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <Share2 className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold">Social Media Templates</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Ready-to-use social media templates for promoting products across different platforms.
              </p>
              <Button variant="outline" className="w-full">
                Access Templates
              </Button>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold">Performance Analytics</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Advanced analytics to track your performance and optimize your marketing strategies.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <a href="/affiliate/analytics">
                  View Analytics
                </a>
              </Button>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <Link className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold">Link Management</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Tools to create, manage, and track all your affiliate links in one place.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <a href="/affiliate/links">
                  Manage Links
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Success Stories</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center mb-4">
                <img 
                  src="/images/affiliate-1.jpg" 
                  alt="Affiliate Success Story" 
                  className="w-16 h-16 rounded-full object-cover mr-4"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80";
                  }}
                />
                <div>
                  <h3 className="text-xl font-semibold">Sarah Johnson</h3>
                  <p className="text-gray-600">Health & Wellness Blogger</p>
                </div>
              </div>
              <p className="text-gray-600 italic mb-4">
                "As a health blogger, I've been able to monetize my content effectively by promoting quality products through AfriPulse GMC. 
                The transparent commission structure and reliable tracking have helped me earn consistent income."
              </p>
              <p className="text-green-600 font-semibold">Earning $2,500+ monthly</p>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center mb-4">
                <img 
                  src="/images/affiliate-2.jpg" 
                  alt="Affiliate Success Story" 
                  className="w-16 h-16 rounded-full object-cover mr-4"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80";
                  }}
                />
                <div>
                  <h3 className="text-xl font-semibold">Michael Okafor</h3>
                  <p className="text-gray-600">Real Estate Influencer</p>
                </div>
              </div>
              <p className="text-gray-600 italic mb-4">
                "The real estate products on AfriPulse GMC have been a perfect fit for my audience. 
                The high-quality listings and competitive commission rates have made it my top affiliate program."
              </p>
              <p className="text-green-600 font-semibold">Earning $4,000+ monthly</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-xl font-semibold mb-2">How do I earn commissions?</h3>
              <p className="text-gray-600">
                You earn commissions when someone makes a purchase using your unique affiliate link. 
                The commission is calculated based on the product's commission rate set by the seller.
              </p>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-xl font-semibold mb-2">What are the commission rates?</h3>
              <p className="text-gray-600">
                Commission rates vary by product and seller, typically ranging from 5% to 30%. 
                You can see the specific commission rate for each product in the marketplace.
              </p>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-xl font-semibold mb-2">When and how do I get paid?</h3>
              <p className="text-gray-600">
                Payments are processed monthly for all commissions earned in the previous month. 
                You can choose to receive payments via bank transfer, PayPal, or mobile money.
              </p>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-xl font-semibold mb-2">Do I need a website to be an affiliate?</h3>
              <p className="text-gray-600">
                No, you don't necessarily need a website. You can promote products through social media, 
                email marketing, or other channels. However, having a website or blog can help increase your reach.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-green-600 text-white rounded-xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Earning?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our growing community of successful affiliate marketers and start earning commissions by promoting quality products.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="secondary" size="lg" asChild>
              <a href="/affiliate/signup">Create Affiliate Account</a>
            </Button>
            <Button variant="outline" className="bg-transparent text-white border-white hover:bg-green-500" size="lg" asChild>
              <a href="/affiliate/marketplace">Browse Products to Promote</a>
            </Button>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default AffiliateResources;
