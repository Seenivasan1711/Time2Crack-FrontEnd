import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// Layouts
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Pages
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import ProductsPage from './features/products/ProductsPage';
import ProductDetailPage from './features/products/ProductDetailPage';
import CartPage from './features/cart/CartPage';
import OrdersPage from './features/orders/OrdersPage';
import DeliveryPage from './features/orders/DeliveryPage';
import NotFoundPage from './components/NotFoundPage';

// Components
import AuthRoute from './features/auth/AuthRoute';

// Store
import { checkAuth } from './features/auth/authSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is authenticated on app load
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/products\" replace />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        
        <Route element={<AuthRoute />}>
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/delivery" element={<DeliveryPage />} />
        </Route>
      </Route>

      {/* 404 route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;