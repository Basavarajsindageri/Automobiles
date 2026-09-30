import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';

import RootLayout from './layouts/RootLayout';
import ProtectedRoute from './routes/ProtectedRoute';

import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import WishlistPage from './pages/WishlistPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import OtpVerificationPage from './pages/auth/OtpVerificationPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

import AccountLayout from './pages/account/AccountLayout';
import ProfilePage from './pages/account/ProfilePage';
import AddressesPage from './pages/account/AddressesPage';
import OrdersPage from './pages/account/OrdersPage';
import OrderDetailsPage from './pages/account/OrderDetailsPage';
import ChangePasswordPage from './pages/account/ChangePasswordPage';

import AdminDashboardPage from './pages/admin/AdminDashboardPage';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Routes>
                <Route path="/" element={<RootLayout />}>
                  {/* Public Routes */}
                  <Route index element={<HomePage />} />
                  <Route path="category/:categorySlug" element={<CategoryPage />} />
                  <Route path="search" element={<SearchPage />} />
                  <Route path="product/:slug" element={<ProductDetailsPage />} />
                  <Route path="admin" element={<AdminDashboardPage />} />

                  {/* Auth Routes */}
                  <Route path="login" element={<LoginPage />} />
                  <Route path="register" element={<RegisterPage />} />
                  <Route path="forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="verify-otp" element={<OtpVerificationPage />} />
                  <Route path="reset-password" element={<ResetPasswordPage />} />

                  {/* Protected Routes */}
                  <Route
                    path="wishlist"
                    element={
                      <ProtectedRoute>
                        <WishlistPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="cart"
                    element={
                      <ProtectedRoute>
                        <CartPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="checkout"
                    element={
                      <ProtectedRoute>
                        <CheckoutPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="order-success"
                    element={
                      <ProtectedRoute>
                        <OrderSuccessPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Account Nested Routes */}
                  <Route
                    path="account"
                    element={
                      <ProtectedRoute>
                        <AccountLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Navigate to="profile" replace />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="addresses" element={<AddressesPage />} />
                    <Route path="orders" element={<OrdersPage />} />
                    <Route path="orders/:id" element={<OrderDetailsPage />} />
                    <Route path="change-password" element={<ChangePasswordPage />} />
                  </Route>

                  {/* 404 Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
