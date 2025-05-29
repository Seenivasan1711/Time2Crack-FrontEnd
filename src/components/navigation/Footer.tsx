import { Link } from 'react-router-dom';
import { ShoppingBag, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">AI Shop</span>
            </Link>
            <p className="text-gray-500 text-sm">
              AI-powered shopping experience with personalized recommendations and smart assistance.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Shop</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/products" className="text-base text-gray-500 hover:text-gray-900">
                  All Products
                </Link>
              </li>
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                  Featured
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                  New Arrivals
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                  Sale
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Account</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/login" className="text-base text-gray-500 hover:text-gray-900">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-base text-gray-500 hover:text-gray-900">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-base text-gray-500 hover:text-gray-900">
                  Order History
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-base text-gray-500 hover:text-gray-900">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} AI Shop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;