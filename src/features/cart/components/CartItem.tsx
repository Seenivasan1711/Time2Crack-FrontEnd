import { Minus, Plus, Trash } from 'lucide-react';
import { CartItem as CartItemType } from '../cartSlice';
import { Link } from 'react-router-dom';

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const CartItem = ({ item, onRemove, onUpdateQuantity }: CartItemProps) => {
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0 && newQuantity <= item.stock) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };
  
  return (
    <li className="p-6 flex flex-col sm:flex-row">
      <div className="flex-shrink-0 w-full sm:w-24 h-24 mb-4 sm:mb-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover object-center rounded-md"
        />
      </div>
      
      <div className="sm:ml-6 flex-1">
        <div className="flex justify-between">
          <div>
            <Link to={`/products/${item.id}`} className="text-lg font-medium text-gray-900 hover:text-primary-600">
              {item.name}
            </Link>
            <p className="mt-1 text-sm text-gray-500">{item.category}</p>
          </div>
                        <p className="text-lg font-medium text-gray-900">${Number(item.price).toFixed(2)}</p>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="p-2 text-gray-600 hover:text-gray-900"
              disabled={item.quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-4 py-2 text-gray-900">{item.quantity}</span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="p-2 text-gray-600 hover:text-gray-900"
              disabled={item.quantity >= item.stock}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          <button
            onClick={() => onRemove(item.id)}
            className="text-red-600 hover:text-red-800 flex items-center"
          >
            <Trash className="h-4 w-4 mr-1" />
            <span className="text-sm">Remove</span>
          </button>
        </div>
        
        <div className="mt-2 text-sm text-gray-700">
                          Subtotal: ${(Number(item.price) * item.quantity).toFixed(2)}
        </div>
      </div>
    </li>
  );
};

export default CartItem;