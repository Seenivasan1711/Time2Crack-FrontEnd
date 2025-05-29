import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { addToCart } from '../../cart/cartSlice';
import { Product } from '../productsSlice';
import { ShoppingCart, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ ...product, quantity: 1 }));
  };
  
  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/products/${product.id}`} className="block">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
          <img
            src={product.image}
            alt={product.name}
            className="h-48 w-full object-cover object-center group-hover:opacity-75"
          />
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm text-gray-700">{product.name}</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">${product.price.toFixed(2)}</p>
            </div>
            
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
              <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
            </div>
          </div>
          
          <p className="mt-2 text-sm text-gray-500 line-clamp-2">{product.description}</p>
          
          <div className="mt-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          
          <div className="mt-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;