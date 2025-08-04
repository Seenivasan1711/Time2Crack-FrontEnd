import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CartItem } from '../../types';
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

// Backend order interface
export interface BackendOrder {
  id: number;
  userId: number;
  status: string;
  totalAmount: number;
  shippingAddress: string;
  deliveryDate: string;
  createdAt: string;
  updatedAt: string;
  orderItems: Array<{
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
    createdAt: string;
    product: {
      id: number;
      name: string;
      description: string;
      price: string;
      stock: number;
      categoryId: number;
      slug: string;
      imageUrl: string;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    };
  }>;
}

// Frontend order interface for display
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

// Helper function to convert backend order to frontend format
const convertBackendOrderToFrontend = (backendOrder: BackendOrder): Order => {
  const items: CartItem[] = backendOrder.orderItems.map(item => ({
    id: item.product.id,
    name: item.product.name,
    description: item.product.description,
    price: typeof item.product.price === 'string' ? parseFloat(item.product.price) : item.product.price,
    stock: item.product.stock,
    categoryId: item.product.categoryId,
    slug: item.product.slug,
    imageUrl: item.product.imageUrl,
    isActive: item.product.isActive,
    createdAt: item.product.createdAt,
    updatedAt: item.product.updatedAt,
    quantity: item.quantity,
  }));

  return {
    id: backendOrder.id.toString(),
    items,
    total: backendOrder.totalAmount,
    status: backendOrder.status as any,
    createdAt: backendOrder.createdAt,
    deliveryInfo: {
      fullName: 'User', // This would come from user profile
      address: backendOrder.shippingAddress || '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      phone: '',
      deliveryDate: backendOrder.deliveryDate || '',
      deliveryTime: '',
      specialInstructions: '',
    },
  };
};

// Fetch all orders
export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get('/orders');
    return response.data.map(convertBackendOrderToFrontend);
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
      const orderData = {
        items: items.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: total,
        shippingAddress: `${deliveryInfo.address}, ${deliveryInfo.city}, ${deliveryInfo.state} ${deliveryInfo.zipCode}`,
        deliveryDate: deliveryInfo.deliveryDate,
      };

      const response = await axiosClient.post('/orders', orderData);
      return convertBackendOrderToFrontend(response.data);
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