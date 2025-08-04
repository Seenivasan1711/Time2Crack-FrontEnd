import { configureStore } from '@reduxjs/toolkit';

// Import reducers
import authSlice from '../features/auth/authSlice';
import cartSlice from '../features/cart/cartSlice';
import productsSlice from '../features/products/productsSlice';
import ordersSlice from '../features/orders/ordersSlice';

// Create store
const store = configureStore({
  reducer: {
    auth: authSlice,
    cart: cartSlice,
    products: productsSlice,
    orders: ordersSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export { store };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;