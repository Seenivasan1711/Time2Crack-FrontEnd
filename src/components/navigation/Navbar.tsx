import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { logout } from '../../features/auth/authSlice';
import { ShoppingBag, ShoppingCart, Menu, X, User, LogOut } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  return (
    <nav className="glass sticky top-0 z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center"
              >
                <ShoppingBag className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                <span className="ml-2 text-xl font-bold">Time2Crack</span>
              </motion.div>
            </Link>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/products"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
              >
                Products
              </Link>
              
              {isAuthenticated && (
                <Link
                  to="/orders"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                >
                  Orders
                </Link>
              )}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <ThemeToggle />
            
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link
                to="/cart"
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-100 relative"
              >
                <span className="sr-only">View cart</span>
                <ShoppingCart className="h-6 w-6" />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Link>
            </motion.div>
            
            {isAuthenticated ? (
              <div className="ml-3 relative">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium">
                    {user?.name}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleLogout}
                    className="p-1 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-100"
                  >
                    <span className="sr-only">Log out</span>
                    <LogOut className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="ml-3 flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 font-medium transition-colors"
                >
                  Sign in
                </Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className="btn btn-primary"
                  >
                    Sign up
                  </Link>
                </motion.div>
              </div>
            )}
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden overflow-hidden"
          >
            {/* Mobile menu content */}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;