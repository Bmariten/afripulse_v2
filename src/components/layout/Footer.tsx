import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Linkedin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { user } = useAuth();

  let productsLink = '/products';
  if (user) {
    if (user.role === 'seller') {
      productsLink = '/seller/products';
    } else if (user.role === 'affiliate') {
      productsLink = '/affiliate/products';
    }
  }

  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">AfriPulse GMC</h3>
            <p className="text-sm text-gray-600">
              The premier marketplace for health & wellness and real estate products.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-gray-500 hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-500 hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-500 hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-gray-500 hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" aria-label="YouTube" className="text-gray-500 hover:text-primary">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary">Home</Link>
              </li>
              <li>
                <Link to={productsLink} className="text-gray-600 hover:text-primary">Products</Link>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary">About Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary">Contact</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Sellers & Affiliates</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/seller/signup" className="text-gray-600 hover:text-primary">Become a Seller</Link>
              </li>
              <li>
                <Link to="/affiliate/signup" className="text-gray-600 hover:text-primary">Become an Affiliate</Link>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary">Seller Resources</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary">Affiliate Resources</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary">Refund Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary">Cookie Policy</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6">
          <p className="text-center text-sm text-gray-500">
            &copy; {currentYear} AfriPulse GMC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
