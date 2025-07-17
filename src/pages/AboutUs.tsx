import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Building2, Users, Globe, Award, Heart } from 'lucide-react';

const AboutUs: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About AfriPulse GMC</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The premier marketplace connecting health & wellness and real estate products 
            with customers across Africa and beyond.
          </p>
        </div>

        {/* Our Story */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Founded in 2023, AfriPulse GMC was born from a vision to create a specialized marketplace 
              that connects quality health & wellness and real estate products with customers who need them.
            </p>
            <p className="text-gray-600 mb-4">
              We recognized the growing demand for these products across Africa and the challenges that both 
              sellers and buyers face in this market. By creating a dedicated platform, we're able to provide 
              a seamless experience for all parties involved.
            </p>
            <p className="text-gray-600">
              Today, AfriPulse GMC serves thousands of customers, sellers, and affiliates, 
              facilitating transactions and building a community around quality products and services.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img 
              src="/images/about-us-story.jpg" 
              alt="AfriPulse GMC team" 
              className="w-full h-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80";
              }}
            />
          </div>
        </div>

        {/* Our Mission */}
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-8 mb-20">
          <div className="text-center max-w-3xl mx-auto">
            <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl text-gray-700">
              To empower businesses and individuals by providing a trusted platform where quality health & wellness 
              and real estate products can be discovered, promoted, and purchased with confidence.
            </p>
          </div>
        </div>

        {/* What We Offer */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">What We Offer</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <Building2 className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">For Sellers</h3>
              <p className="text-gray-600">
                A dedicated platform to showcase your products to a targeted audience, 
                with tools to manage listings, track sales, and grow your business.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <Users className="h-10 w-10 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">For Affiliates</h3>
              <p className="text-gray-600">
                Opportunities to earn commission by promoting quality products through your networks, 
                with transparent tracking and timely payouts.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <Globe className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">For Customers</h3>
              <p className="text-gray-600">
                Access to a curated selection of health & wellness and real estate products, 
                with secure payment options and reliable delivery.
              </p>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Award className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality</h3>
              <p className="text-gray-600">We prioritize quality in every aspect of our platform and the products we feature.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-600">We foster a supportive community of sellers, affiliates, and customers.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Globe className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Accessibility</h3>
              <p className="text-gray-600">We strive to make our platform accessible to businesses and customers across Africa.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Integrity</h3>
              <p className="text-gray-600">We operate with transparency, honesty, and fairness in all our dealings.</p>
            </div>
          </div>
        </div>

        {/* Join Us CTA */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Join the AfriPulse GMC Community</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Whether you're a seller looking to expand your reach, an affiliate seeking profitable partnerships, 
            or a customer in search of quality products, we invite you to be part of our growing community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/seller/signup" className="bg-white text-primary-600 hover:bg-gray-100 px-6 py-3 rounded-md font-semibold">
              Become a Seller
            </a>
            <a href="/affiliate/signup" className="bg-transparent hover:bg-primary-500 border-2 border-white px-6 py-3 rounded-md font-semibold">
              Become an Affiliate
            </a>
            <a href="/products" className="bg-transparent hover:bg-primary-500 border-2 border-white px-6 py-3 rounded-md font-semibold">
              Browse Products
            </a>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutUs;
