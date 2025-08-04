import { useEffect, useState } from 'react';
import axiosClient from '../services/axiosClient';

const DebugProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get('/products');
        console.log('API Response:', response.data);
        setProducts(response.data);
      } catch (err) {
        console.error('API Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Debug Products ({products.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product: any) => (
          <div key={product.id} className="border p-4 rounded">
            <h3 className="font-bold">{product.name}</h3>
            <p className="text-sm text-gray-600">{product.description}</p>
            <p className="text-lg font-bold">₹{product.price}</p>
            <p className="text-sm">Category: {product.category?.name || `ID: ${product.categoryId}`}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DebugProducts; 