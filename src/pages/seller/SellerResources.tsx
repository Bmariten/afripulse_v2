import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Store, 
  BarChart3, 
  ImagePlus, 
  Truck, 
  ShieldCheck, 
  DollarSign, 
  FileText, 
  Download,
  ArrowRight
} from 'lucide-react';

const SellerResources: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Seller Resources</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to succeed as a seller on AfriPulse GMC. 
            Access guides, tools, and resources to grow your business.
          </p>
        </div>

        {/* Getting Started Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Getting Started</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="bg-primary-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Store className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Create Your Store</h3>
              <p className="text-gray-600 mb-4">
                Set up your seller profile with business details, logo, and description to build your brand presence.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <a href="/seller/signup">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </Card>

            <Card className="p-6">
              <div className="bg-primary-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <ImagePlus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">List Your Products</h3>
              <p className="text-gray-600 mb-4">
                Learn how to create compelling product listings with high-quality images and descriptions.
              </p>
              <Button variant="outline" className="w-full">
                View Guide <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>

            <Card className="p-6">
              <div className="bg-primary-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Track Performance</h3>
              <p className="text-gray-600 mb-4">
                Use our analytics tools to monitor sales, track customer engagement, and optimize your listings.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <a href="/seller/dashboard">
                  Access Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </Card>
          </div>
        </section>

        {/* Seller Guides */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Seller Guides</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                Product Photography Guide
              </h3>
              <p className="text-gray-600 mb-4">
                Learn how to take professional-quality photos of your products using just your smartphone.
              </p>
              <Button variant="ghost" className="text-primary">
                Read Guide <Download className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                Writing Effective Product Descriptions
              </h3>
              <p className="text-gray-600 mb-4">
                Craft compelling product descriptions that convert browsers into buyers.
              </p>
              <Button variant="ghost" className="text-primary">
                Read Guide <Download className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                Pricing Strategies for Maximum Profit
              </h3>
              <p className="text-gray-600 mb-4">
                Discover effective pricing strategies to maximize your sales and profit margins.
              </p>
              <Button variant="ghost" className="text-primary">
                Read Guide <Download className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                Working with Affiliates
              </h3>
              <p className="text-gray-600 mb-4">
                Learn how to leverage our affiliate network to increase your product visibility and sales.
              </p>
              <Button variant="ghost" className="text-primary">
                Read Guide <Download className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Key Seller Benefits */}
        <section className="mb-16 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Key Benefits for Sellers</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <ShieldCheck className="h-8 w-8 text-primary mr-3" />
                <h3 className="text-xl font-semibold">Secure Platform</h3>
              </div>
              <p className="text-gray-600">
                Our platform uses industry-standard security measures to protect your business and customer data.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <DollarSign className="h-8 w-8 text-primary mr-3" />
                <h3 className="text-xl font-semibold">Competitive Fees</h3>
              </div>
              <p className="text-gray-600">
                Enjoy competitive commission rates and transparent fee structure with no hidden charges.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <Truck className="h-8 w-8 text-primary mr-3" />
                <h3 className="text-xl font-semibold">Logistics Support</h3>
              </div>
              <p className="text-gray-600">
                Access our network of trusted logistics partners for efficient product delivery across Africa.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-xl font-semibold mb-2">How do I become a verified seller?</h3>
              <p className="text-gray-600">
                After creating your seller account, complete your business profile and submit the required documentation. 
                Our team will review your application and verify your business within 2-3 business days.
              </p>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-xl font-semibold mb-2">What commission rates does AfriPulse GMC charge?</h3>
              <p className="text-gray-600">
                Commission rates vary by product category, typically ranging from 5% to 15%. 
                You can view the specific rates for your products in your seller dashboard.
              </p>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-xl font-semibold mb-2">How and when do I get paid?</h3>
              <p className="text-gray-600">
                Payments are processed every two weeks for all completed orders. 
                Funds are transferred directly to your registered bank account or mobile money wallet.
              </p>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-xl font-semibold mb-2">Can I set my own commission rates for affiliates?</h3>
              <p className="text-gray-600">
                Yes, you can set custom commission rates for affiliates who promote your products. 
                Higher commission rates often attract more affiliate marketers to promote your products.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary-600 text-white rounded-xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Selling?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of successful sellers on AfriPulse GMC and reach customers across Africa and beyond.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="secondary" size="lg" asChild>
              <a href="/seller/signup">Create Seller Account</a>
            </Button>
            <Button variant="outline" className="bg-transparent text-white border-white hover:bg-primary-500" size="lg" asChild>
              <a href="/contact">Contact Sales Team</a>
            </Button>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default SellerResources;
