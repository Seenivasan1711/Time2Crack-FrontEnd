import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { createOrder, setDeliveryInfo } from './ordersSlice';
import { clearCart } from '../cart/cartSlice';
import FormInput from '../../components/forms/FormInput';
import FormSelect from '../../components/forms/FormSelect';
import { MapPin, Calendar, Clock, Truck } from 'lucide-react';

// Form validation schema
const deliverySchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  zipCode: z.string().min(5, 'ZIP code must be at least 5 characters'),
  country: z.string().min(2, 'Country must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  deliveryDate: z.string().min(1, 'Delivery date is required'),
  deliveryTime: z.string().min(1, 'Delivery time is required'),
  specialInstructions: z.string().optional(),
});

type DeliveryFormValues = z.infer<typeof deliverySchema>;

const DeliveryPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items } = useAppSelector((state) => state.cart);
  const { isLoading } = useAppSelector((state) => state.orders);
  const [step, setStep] = useState(1);
  
  // Calculate cart totals
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = 10;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;
  
  // Get available delivery dates (next 7 days)
  const getDeliveryDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const formattedDate = date.toISOString().split('T')[0];
      const displayDate = date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      
      dates.push({ value: formattedDate, label: displayDate });
    }
    
    return dates;
  };
  
  // Get available delivery times
  const getDeliveryTimes = () => {
    return [
      { value: '09:00', label: '9:00 AM - 11:00 AM' },
      { value: '11:00', label: '11:00 AM - 1:00 PM' },
      { value: '13:00', label: '1:00 PM - 3:00 PM' },
      { value: '15:00', label: '3:00 PM - 5:00 PM' },
      { value: '17:00', label: '5:00 PM - 7:00 PM' },
    ];
  };
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      fullName: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      phone: '',
      deliveryDate: getDeliveryDates()[0].value,
      deliveryTime: getDeliveryTimes()[0].value,
      specialInstructions: '',
    },
  });
  
  const onSubmit = async (data: DeliveryFormValues) => {
    if (step === 1) {
      dispatch(setDeliveryInfo(data));
      setStep(2);
    } else {
      try {
        await dispatch(createOrder({ items, total, deliveryInfo: data })).unwrap();
        dispatch(clearCart());
        navigate('/orders');
      } catch (err) {
        // Error is handled in the slice
      }
    }
  };
  
  if (items.length === 0) {
    navigate('/cart');
    return null;
  }
  
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center h-8 w-8 rounded-full ${
                    step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  1
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-medium text-gray-900">Delivery Information</h2>
                </div>
              </div>
            </div>
            
            {step === 1 && (
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <FormInput
                      label="Full Name"
                      {...register('fullName')}
                      error={errors.fullName?.message}
                      icon={<MapPin className="h-5 w-5 text-gray-400" />}
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <FormInput
                      label="Address"
                      {...register('address')}
                      error={errors.address?.message}
                      icon={<MapPin className="h-5 w-5 text-gray-400" />}
                    />
                  </div>
                  
                  <div>
                    <FormInput
                      label="City"
                      {...register('city')}
                      error={errors.city?.message}
                    />
                  </div>
                  
                  <div>
                    <FormInput
                      label="State / Province"
                      {...register('state')}
                      error={errors.state?.message}
                    />
                  </div>
                  
                  <div>
                    <FormInput
                      label="ZIP / Postal Code"
                      {...register('zipCode')}
                      error={errors.zipCode?.message}
                    />
                  </div>
                  
                  <div>
                    <FormInput
                      label="Country"
                      {...register('country')}
                      error={errors.country?.message}
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <FormInput
                      label="Phone Number"
                      type="tel"
                      {...register('phone')}
                      error={errors.phone?.message}
                    />
                  </div>
                  
                  <div>
                    <FormSelect
                      label="Delivery Date"
                      {...register('deliveryDate')}
                      options={getDeliveryDates()}
                      error={errors.deliveryDate?.message}
                      icon={<Calendar className="h-5 w-5 text-gray-400" />}
                    />
                  </div>
                  
                  <div>
                    <FormSelect
                      label="Delivery Time"
                      {...register('deliveryTime')}
                      options={getDeliveryTimes()}
                      error={errors.deliveryTime?.message}
                      icon={<Clock className="h-5 w-5 text-gray-400" />}
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700">
                      Special Instructions (Optional)
                    </label>
                    <textarea
                      id="specialInstructions"
                      {...register('specialInstructions')}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Continue to Payment
                  </button>
                </div>
              </form>
            )}
            
            {step === 2 && (
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div
                    className={`flex items-center justify-center h-8 w-8 rounded-full ${
                      step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    2
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-medium text-gray-900">Payment Method</h2>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                  <p className="text-sm text-gray-500">
                    This is a demo application. No actual payment will be processed.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="border border-gray-300 rounded-md p-4 flex items-start">
                    <input
                      id="payment-credit-card"
                      name="payment-method"
                      type="radio"
                      checked
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 mt-1"
                    />
                    <label htmlFor="payment-credit-card" className="ml-3 block text-sm font-medium text-gray-700">
                      Credit Card
                      <span className="block text-sm text-gray-500">
                        All major credit cards accepted
                      </span>
                    </label>
                  </div>
                  
                  <div className="border border-gray-300 rounded-md p-4 flex items-start">
                    <input
                      id="payment-paypal"
                      name="payment-method"
                      type="radio"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 mt-1"
                    />
                    <label htmlFor="payment-paypal" className="ml-3 block text-sm font-medium text-gray-700">
                      PayPal
                      <span className="block text-sm text-gray-500">
                        Pay with your PayPal account
                      </span>
                    </label>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Back
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    disabled={isLoading}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    {isLoading ? (
                      <>
                        <div className="mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Truck className="mr-2 h-5 w-5" />
                        Place Order
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:w-1/3 mt-8 lg:mt-0">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
            </div>
            
            <ul className="divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.id} className="p-4 flex">
                  <div className="flex-shrink-0 w-16 h-16">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-center rounded-md"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <p className="text-gray-600">Subtotal</p>
                <p className="text-gray-900 font-medium">${subtotal.toFixed(2)}</p>
              </div>
              
              <div className="flex justify-between">
                <p className="text-gray-600">Shipping</p>
                <p className="text-gray-900 font-medium">${shipping.toFixed(2)}</p>
              </div>
              
              <div className="flex justify-between">
                <p className="text-gray-600">Tax (8%)</p>
                <p className="text-gray-900 font-medium">${tax.toFixed(2)}</p>
              </div>
              
              <div className="border-t border-gray-200 pt-4 flex justify-between">
                <p className="text-lg font-medium text-gray-900">Total</p>
                <p className="text-lg font-bold text-gray-900">${total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPage;