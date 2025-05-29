import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../services/axiosClient';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  stock: number;
}

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
  };
}

// Mock data for products
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium wireless headphones with active noise cancellation for an immersive audio experience.',
    price: 299.99,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Electronics',
    rating: 4.8,
    stock: 15,
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    description: 'Track your fitness goals with this advanced smartwatch featuring heart rate monitoring and GPS.',
    price: 199.99,
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Electronics',
    rating: 4.5,
    stock: 20,
  },
  {
    id: '3',
    name: 'Ergonomic Office Chair',
    description: 'Comfortable office chair with lumbar support and adjustable height for better posture.',
    price: 249.99,
    image: 'https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Furniture',
    rating: 4.3,
    stock: 8,
  },
  {
    id: '4',
    name: 'Organic Cotton T-Shirt',
    description: 'Soft and breathable t-shirt made from 100% organic cotton.',
    price: 29.99,
    image: 'https://images.pexels.com/photos/5698851/pexels-photo-5698851.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Clothing',
    rating: 4.2,
    stock: 50,
  },
  {
    id: '5',
    name: 'Professional Blender',
    description: 'High-powered blender for smoothies, soups, and more with multiple speed settings.',
    price: 129.99,
    image: 'https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Kitchen',
    rating: 4.7,
    stock: 12,
  },
  {
    id: '6',
    name: 'Leather Wallet',
    description: 'Genuine leather wallet with multiple card slots and RFID protection.',
    price: 49.99,
    image: 'https://images.pexels.com/photos/2079438/pexels-photo-2079438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Accessories',
    rating: 4.4,
    stock: 30,
  },
];

// Fetch all products
export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    // In a real app, this would be an API call
    // For demo purposes, we'll use mock data
    return mockProducts;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
  }
});

// Fetch a single product by ID
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: string, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll use mock data
      const product = mockProducts.find((p) => p.id === id);
      
      if (!product) {
        throw new Error('Product not found');
      }
      
      return product;
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
        state.items = action.payload;
        state.filteredItems = action.payload;
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
        state.selectedProduct = action.payload;
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
    const matchesCategory = filters.category
      ? product.category === filters.category
      : true;
    
    // Filter by price range
    const matchesPrice =
      product.price >= filters.minPrice && product.price <= filters.maxPrice;
    
    return matchesSearch && matchesCategory && matchesPrice;
  });
};

export const { setSearchTerm, setFilter, clearFilters } = productsSlice.actions;
export default productsSlice.reducer;