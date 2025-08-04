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
  const categories = [...new Set(useAppSelector((state) => state.products.items).map((product) => product.category?.name || `Category ${product.categoryId}`))];
  
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
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`btn btn-outline transition-all duration-200 ${
              showFilters ? 'bg-primary-50 border-primary-300 text-primary-700 dark:bg-primary-900/20 dark:border-primary-600 dark:text-primary-300' : ''
            }`}
          >
            <motion.div
              transition={{ 
                duration: 0.4,
                ease: "easeInOut"
              }}
            >
              <Filter className="h-5 w-5" />
            </motion.div>
          </motion.button>
          
          {(filters.category || filters.minPrice > 0 || filters.maxPrice < 1000 || filters.stock) && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleClearFilters}
              className="btn btn-outline text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-all duration-200"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.3 }}
              >
                <X className="h-5 w-5 mr-2" />
              </motion.div>
              Clear
            </motion.button>
          )}
        </div>
      </motion.div>
      
      <AnimatePresence mode="wait">
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ 
              duration: 0.4,
              ease: "easeOut",
              type: "spring",
              stiffness: 200,
              damping: 25
            }}
            className="glass p-4 rounded-lg origin-top"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <motion.label 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Category
                </motion.label>
                <select
                  value={filters.category}
                  onChange={handleCategoryChange}
                  className="w-full input transition-all duration-200 focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <motion.label 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Price Range
                </motion.label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handlePriceChange(Number(e.target.value), filters.maxPrice)}
                    className="w-1/2 input transition-all duration-200 focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handlePriceChange(filters.minPrice, Number(e.target.value))}
                    className="w-1/2 input transition-all duration-200 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Stock Filter */}
              <div>
                <motion.label 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Stock Status
                </motion.label>
                <select
                  value={filters.stock || ''}
                  onChange={(e) => dispatch(setFilter({ stock: e.target.value }))}
                  className="w-full input transition-all duration-200 focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Stock</option>
                  <option value="in-stock">In Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6,
            ease: "easeOut",
            delay: showFilters ? 0.3 : 0
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredItems.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ 
                  delay: (index * 0.05) + (showFilters ? 0.4 : 0),
                  duration: 0.5,
                  ease: "easeOut"
                }}
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