import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CartItem, Order as BackendOrder } from '../../types';
import axiosClient from '../../services/axiosClient';

export interface DeliveryInfo {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  deliveryDate: string;
  deliveryTime: string;
  specialInstructions: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  deliveryInfo: DeliveryInfo;
}

interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  deliveryInfo: DeliveryInfo | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
  deliveryInfo: null,
  isLoading: false,
  error: null,
};

// Mock data for orders
const mockOrders: Order[] = [
  {
    id: '1',
    items: [
      {
        id: '1',
        name: 'Wireless Noise-Cancelling Headphones',
        description: 'Premium wireless headphones with active noise cancellation for an immersive audio experience.',
        price: 299.99,
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        category: 'Electronics',
        rating: 4.8,
        stock: 15,
        quantity: 1,
      },
    ],
    total: 299.99,
    status: 'delivered',
    createdAt: '2023-01-15T12:00:00Z',
    deliveryInfo: {
      fullName: 'John Doe',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      phone: '555-123-4567',
      deliveryDate: '2023-01-20',
      deliveryTime: '14:00',
      specialInstructions: 'Leave at the door',
    },
  },
  {
    id: '2',
    items: [
      {
        id: '2',
        name: 'Smart Fitness Watch',
        description: 'Track your fitness goals with this advanced smartwatch featuring heart rate monitoring and GPS.',
        price: 199.99,
        image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        category: 'Electronics',
        rating: 4.5,
        stock: 20,
        quantity: 1,
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
        quantity: 2,
      },
    ],
    total: 259.97,
    status: 'shipped',
    createdAt: '2023-02-10T15:30:00Z',
    deliveryInfo: {
      fullName: 'John Doe',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      phone: '555-123-4567',
      deliveryDate: '2023-02-15',
      deliveryTime: '10:00',
      specialInstructions: '',
    },
  },
];

// Fetch all orders
export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    // In a real app, this would be an API call
    // For demo purposes, we'll use mock data
    return mockOrders;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
  }
});

// Create a new order
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (
    { items, total, deliveryInfo }: { items: CartItem[]; total: number; deliveryInfo: DeliveryInfo },
    { rejectWithValue }
  ) => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll create a mock order
      const newOrder: Order = {
        id: Math.random().toString(36).substring(2, 9),
        items,
        total,
        status: 'pending',
        createdAt: new Date().toISOString(),
        deliveryInfo,
      };
      
      return newOrder;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create order');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setDeliveryInfo: (state, action) => {
      state.deliveryInfo = action.payload;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders.unshift(action.payload);
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setDeliveryInfo, clearCurrentOrder } = ordersSlice.actions;
export default ordersSlice.reducer;