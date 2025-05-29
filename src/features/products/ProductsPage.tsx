import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { fetchProducts, setSearchTerm, setFilter, clearFilters } from './productsSlice';
import ProductCard from './components/ProductCard';
import EmptyState from '../../components/EmptyState';
import { Search, Filter, X, PackageSearch } from 'lucide-react';

const ProductsPage = () => {
  const dispatch = useAppDispatch();
  const { filteredItems, isLoading, error, searchTerm, filters } = useAppSelector((state) => state.products);
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilter({ category: e.target.value }));
  };
  
  const handlePriceChange = (minPrice: number, maxPrice: number) => {
    dispatch(setFilter({ minPrice, maxPrice }));
  };
  
  const handleClearFilters = () => {
    dispatch(clearFilters());
  };
  
  // Get unique categories from products
  const categories = [...new Set(useAppSelector((state) => state.products.items).map((product) => product.category))];
  
  if (isLoading && filteredItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 p-4 mb-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 input"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-outline"
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </motion.button>
          
          {(filters.category || filters.minPrice > 0 || filters.maxPrice < 1000) && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClearFilters}
              className="btn btn-outline text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              <X className="h-5 w-5 mr-2" />
              Clear
            </motion.button>
          )}
        </div>
      </motion.div>
      
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass p-4 rounded-lg overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filter controls */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {filteredItems.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title="No products found"
          description="Try adjusting your search or filters to find what you're looking for."
          action={
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClearFilters}
              className="btn btn-primary"
            >
              Clear all filters
            </motion.button>
          }
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredItems.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default ProductsPage;