import { useEffect } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { fetchOrders } from './ordersSlice';
import { Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';

const OrdersPage = () => {
  const dispatch = useAppDispatch();
  const { orders, isLoading, error } = useAppSelector((state) => state.orders);
  
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };
  
  if (isLoading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-16 w-16 text-gray-400" />
        <h2 className="mt-4 text-2xl font-medium text-gray-900">No orders yet</h2>
        <p className="mt-2 text-gray-500">When you place orders, they will appear here.</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Order History</h2>
        </div>
        
        <ul className="divide-y divide-gray-200">
          {orders.map((order) => (
            <li key={order.id} className="p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <p className="text-sm text-gray-500">
                    Order #{order.id} • {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <div className="mt-2 flex items-center">
                    {getStatusIcon(order.status)}
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0">
                  <p className="text-lg font-medium text-gray-900">${order.total.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{order.items.length} items</p>
                </div>
              </div>
              
              <div className="mt-6 border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-900">Items</h3>
                <ul className="mt-2 divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <li key={item.id} className="py-3 flex">
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
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-6 border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-900">Delivery Information</h3>
                <div className="mt-2 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium text-gray-900">Address:</span>{' '}
                    {order.deliveryInfo.address}, {order.deliveryInfo.city},{' '}
                    {order.deliveryInfo.state} {order.deliveryInfo.zipCode},{' '}
                    {order.deliveryInfo.country}
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium text-gray-900">Recipient:</span>{' '}
                    {order.deliveryInfo.fullName}
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium text-gray-900">Phone:</span>{' '}
                    {order.deliveryInfo.phone}
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium text-gray-900">Delivery Date:</span>{' '}
                    {order.deliveryInfo.deliveryDate} at {order.deliveryInfo.deliveryTime}
                  </div>
                  {order.deliveryInfo.specialInstructions && (
                    <div className="sm:col-span-2 text-sm text-gray-500">
                      <span className="font-medium text-gray-900">Special Instructions:</span>{' '}
                      {order.deliveryInfo.specialInstructions}
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrdersPage;