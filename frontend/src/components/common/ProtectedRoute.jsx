import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/zustand/auth';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, status } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (status !== 'loading' && !isAuthenticated) {
      toast.error('Please, sign in.');
    }
  }, [status, isAuthenticated]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
