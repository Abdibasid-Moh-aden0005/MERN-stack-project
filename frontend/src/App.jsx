import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuthStore from './store/zustand/auth';

// Layout
import Sidebar from './components/layout/Sidebar';
import ProtectedRoute from './components/common/ProtectedRoute';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Cars from './pages/admin/Cars';
import AdminBookings from './pages/admin/AdminBookings';
import Customers from './pages/admin/Customers';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// User Pages
import Home from './pages/user/Home';
import Profile from './pages/user/Profile';
import MyBookings from './pages/user/MyBookings';
import CarDetails from './components/cars/CarDetails';

function AppContent() {
  const { isAuthenticated, user, status } = useAuthStore();
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  if (status === 'loading' && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-dark text-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex  min-h-screen bg-bg-dark overflow-hidden">
      {/* Show sidebar for all logged in users, but Sidebar component handles internal role-based filtering */}
      {!isAuthPage && isAuthenticated && <Sidebar />}
      
      <main className="w-full overflow-y-auto">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cars/:id" element={<CarDetails />} />

          {/* Admin Protected Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly>
                <div className="p-8"><Dashboard /></div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/cars" 
            element={
              <ProtectedRoute adminOnly>
                <div className="p-8"><Cars /></div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/bookings" 
            element={
              <ProtectedRoute adminOnly>
                <div className="p-8"><AdminBookings /></div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/customers" 
            element={
              <ProtectedRoute adminOnly>
                <div className="p-8"><Customers /></div>
              </ProtectedRoute>
            } 
          />
          
          {/* User Protected Routes */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <div className="p-8"><Profile /></div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-bookings" 
            element={
              <ProtectedRoute>
                <div className="p-8"><MyBookings /></div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <div className="p-8 text-white">
                  <h1 className="text-3xl font-bold mb-6">Settings</h1>
                  <p className="text-text-dim">Application settings coming soon...</p>
                </div>
              </ProtectedRoute>
            } 
          />

          {/* 404 Redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;