import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../services/axiosClient';
import { Product } from '../../types';

interface ProductsState {
  items: Product[];
  filteredItems: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  filters: {
    category: string;
    minPrice: number;
    maxPrice: number;
    stock: string;
  };
}

// No mock data - all products will be fetched from API

// Fetch all products
export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get('/products');
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
  }
});

// Fetch a single product by ID
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/products/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch product');
    }
  }
);

const initialState: ProductsState = {
  items: [],
  filteredItems: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  searchTerm: '',
  filters: {
    category: '',
    minPrice: 0,
    maxPrice: 1000,
    stock: '',
  },
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.filteredItems = filterProducts(state.items, state.searchTerm, state.filters);
    },
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.filteredItems = filterProducts(state.items, state.searchTerm, state.filters);
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.searchTerm = '';
      state.filteredItems = state.items;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        // Convert price strings to numbers
        const productsWithNumberPrices = action.payload.map((product: Product) => ({
          ...product,
          price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
        }));
        state.items = productsWithNumberPrices;
        state.filteredItems = productsWithNumberPrices;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        // Convert price string to number
        const product = {
          ...action.payload,
          price: typeof action.payload.price === 'string' ? parseFloat(action.payload.price) : action.payload.price,
        };
        state.selectedProduct = product;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Helper function to filter products
const filterProducts = (
  products: Product[],
  searchTerm: string,
  filters: ProductsState['filters']
) => {
  return products.filter((product) => {
    // Filter by search term
    const matchesSearch = searchTerm
      ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    // Filter by category
    const productCategory = product.category?.name || `Category ${product.categoryId}`;
    const matchesCategory = filters.category
      ? productCategory === filters.category
      : true;
    
    // Filter by price range
    const productPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
    const matchesPrice =
      productPrice >= filters.minPrice && productPrice <= filters.maxPrice;
    
    // Filter by stock status
    const matchesStock = filters.stock
      ? (filters.stock === 'in-stock' && product.stock > 0) ||
        (filters.stock === 'out-of-stock' && product.stock === 0)
      : true;
    
    return matchesSearch && matchesCategory && matchesPrice && matchesStock;
  });
};

export const { setSearchTerm, setFilter, clearFilters } = productsSlice.actions;
export default productsSlice.reducer;