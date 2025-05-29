import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { fetchProductById } from './productsSlice';
import { addToCart } from '../cart/cartSlice';
import { Star, ShoppingCart, ArrowLeft } from 'lucide-react';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selectedProduct, isLoading, error } = useAppSelector((state) => state.products);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);
  
  const handleAddToCart = () => {
    if (selectedProduct) {
      dispatch(addToCart({ ...selectedProduct, quantity: 1 }));
      navigate('/cart');
    }
  };
  
  if (isLoading) {
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
  
  if (!selectedProduct) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Product not found.</p>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Products
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4">
      <button
        onClick={() => navigate('/products')}
        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Products
      </button>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0 md:w-1/2">
            <img
              className="h-full w-full object-cover md:h-full md:w-full"
              src={selectedProduct.image}
              alt={selectedProduct.name}
            />
          </div>
          
          <div className="p-8 md:w-1/2">
            <div className="uppercase tracking-wide text-sm text-primary-600 font-semibold">
              {selectedProduct.category}
            </div>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">{selectedProduct.name}</h1>
            
            <div className="mt-4 flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(selectedProduct.rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                    fill="currentColor"
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-600">{selectedProduct.rating} out of 5</span>
            </div>
            
            <div className="mt-6 text-2xl font-bold text-gray-900">${selectedProduct.price.toFixed(2)}</div>
            
            <div className="mt-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                selectedProduct.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {selectedProduct.stock > 0 ? `In Stock (${selectedProduct.stock})` : 'Out of Stock'}
              </span>
            </div>
            
            <div className="mt-6 text-gray-700 space-y-4">
              <p>{selectedProduct.description}</p>
            </div>
            
            <div className="mt-8">
              <button
                onClick={handleAddToCart}
                disabled={selectedProduct.stock === 0}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Details</h2>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
          <div className="prose max-w-none">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel
              ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
              Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl
              nisl sit amet nisl.
            </p>
            
            <h3>Features</h3>
            <ul>
              <li>High-quality materials</li>
              <li>Durable construction</li>
              <li>Easy to use</li>
              <li>Versatile design</li>
              <li>1-year warranty</li>
            </ul>
            
            <h3>Specifications</h3>
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Dimensions
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    10" x 8" x 2"
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Weight
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    1.5 lbs
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Material
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Premium quality
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Color
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Multiple options
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;