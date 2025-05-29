import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { removeFromCart, updateQuantity, clearCart } from './cartSlice';
import CartItem from './components/CartItem';
import { ShoppingBag, ArrowRight, Trash } from 'lucide-react';

const CartPage = () => {
  const { items } = useAppSelector((state) => state.cart);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  
  // Calculate cart totals
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const discount = couponApplied ? subtotal * 0.1 : 0; // 10% discount if coupon applied
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal - discount + shipping;
  
  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
  };
  
  const handleUpdateQuantity = (id: string, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  };
  
  const handleClearCart = () => {
    dispatch(clearCart());
  };
  
  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === 'discount10') {
      setCouponApplied(true);
    } else {
      alert('Invalid coupon code');
    }
  };
  
  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/delivery');
    } else {
      navigate('/login');
    }
  };
  
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
        <h2 className="mt-4 text-2xl font-medium text-gray-900">Your cart is empty</h2>
        <p className="mt-2 text-gray-500">Looks like you haven't added any products to your cart yet.</p>
        <Link
          to="/products"
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">
                  Cart Items ({items.reduce((total, item) => total + item.quantity, 0)})
                </h2>
                <button
                  onClick={handleClearCart}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Clear Cart
                </button>
              </div>
            </div>
            
            <ul className="divide-y divide-gray-200">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onRemove={handleRemoveItem}
                  onUpdateQuantity={handleUpdateQuantity}
                />
              ))}
            </ul>
          </div>
          
          <div className="mt-6">
            <Link
              to="/products"
              className="text-primary-600 hover:text-primary-500 font-medium flex items-center"
            >
              <ArrowRight className="h-4 w-4 mr-1 transform rotate-180" />
              Continue Shopping
            </Link>
          </div>
        </div>
        
        <div className="lg:col-span-4 mt-8 lg:mt-0">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <p className="text-gray-600">Subtotal</p>
                <p className="text-gray-900 font-medium">${subtotal.toFixed(2)}</p>
              </div>
              
              {couponApplied && (
                <div className="flex justify-between text-green-600">
                  <p>Discount (10%)</p>
                  <p>-${discount.toFixed(2)}</p>
                </div>
              )}
              
              <div className="flex justify-between">
                <p className="text-gray-600">Shipping</p>
                <p className="text-gray-900 font-medium">
                  {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                </p>
              </div>
              
              <div className="border-t border-gray-200 pt-4 flex justify-between">
                <p className="text-lg font-medium text-gray-900">Total</p>
                <p className="text-lg font-bold text-gray-900">${total.toFixed(2)}</p>
              </div>
              
              <div className="mt-6">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon code"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Apply
                  </button>
                </div>
                {couponApplied && (
                  <p className="mt-2 text-sm text-green-600">Coupon applied successfully!</p>
                )}
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full mt-6 inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {isAuthenticated ? 'Proceed to Checkout' : 'Sign in to Checkout'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;