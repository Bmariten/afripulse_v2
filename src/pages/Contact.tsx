import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "Thank you for contacting us. We'll respond shortly.",
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">Contact Us</h1>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <Mail className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-3">Email</h3>
            <p className="text-gray-600">support@afripulsegmc.com</p>
            <p className="text-gray-600">info@afripulsegmc.com</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <Phone className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-3">Phone</h3>
            <p className="text-gray-600">+234 123 456 7890</p>
            <p className="text-gray-600">+234 987 654 3210</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <MapPin className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-3">Address</h3>
            <p className="text-gray-600">
              AfriPulse GMC Headquarters<br />
              123 Business Avenue, Suite 456<br />
              Lagos, Nigeria
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="How can we help you?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Please provide details about your inquiry..."
                    rows={6}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
          
          {/* Business Hours and FAQ */}
          <div>
            <div className="bg-white rounded-lg p-8 shadow-lg mb-8">
              <h2 className="text-2xl font-bold mb-6">Business Hours</h2>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Monday - Friday</h3>
                    <p className="text-gray-600">9:00 AM - 5:00 PM WAT</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Saturday</h3>
                    <p className="text-gray-600">10:00 AM - 2:00 PM WAT</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Sunday</h3>
                    <p className="text-gray-600">Closed</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">How do I become a seller?</h3>
                  <p className="text-gray-600">
                    Visit our <a href="/seller/signup" className="text-primary hover:underline">Seller Registration</a> page 
                    to create an account and start listing your products.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">How do affiliate commissions work?</h3>
                  <p className="text-gray-600">
                    Affiliates earn a commission on each sale made through their unique referral links. 
                    Commission rates vary by product and are set by the sellers.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">What payment methods do you accept?</h3>
                  <p className="text-gray-600">
                    We accept credit/debit cards, mobile money, and bank transfers. 
                    For specific payment options, please check during checkout.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Contact;
