import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false, roles = [] }) => {
  const { user, isLoading, error, isAdmin } = useAuth();
  const location = useLocation();

  // Debugging output
  console.log('[ProtectedRoute] Auth state:', { 
    user, 
    isLoading, 
    hasError: !!error,
    path: location.pathname,
    requireAdmin,
    requiredRoles: roles,
    userRole: user?.role,
    isUserAdmin: user?.role === 'admin'
  });

  if (isLoading) {
    return (
      <div className="auth-loading">
        <p>Verifying your session...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="auth-error">
        <h3>Authentication Error</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Refresh Page
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate 
        to="/login" 
        replace 
        state={{ 
          from: location,
          message: 'Please login to access this page' 
        }} 
      />
    );
  }

  // Specific admin check - highest priority
  if (requireAdmin && !isAdmin()) {
    return (
      <Navigate 
        to="/unauthorized" 
        replace 
        state={{ 
          from: location,
          requiredRole: 'admin',
          userRole: user.role,
          message: 'Admin access required' 
        }} 
      />
    );
  }

  // Role-based access control
  if (roles.length > 0 && !roles.includes(user.role)) {
    return (
      <Navigate 
        to="/unauthorized" 
        replace 
        state={{ 
          from: location,
          requiredRoles: roles,
          userRole: user.role,
          message: 'You do not have the required permissions'
        }} 
      />
    );
  }

  return children;
};

export default ProtectedRoute;