import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/stores/authStore';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, token, logout } = useAuthStore();
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const validateToken = async () => {
      if (!isAuthenticated || !token) {
        setIsValidating(false);
        setIsValid(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setIsValid(true);
        } else {
          // Token is invalid, logout user
          logout();
          setIsValid(false);
          toast.error('Session expired. Please login again.');
        }
      } catch (error) {
        console.error('Token validation error:', error);
        logout();
        setIsValid(false);
        toast.error('Authentication failed. Please login again.');
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [isAuthenticated, token, logout]);

  // Show loading spinner while validating
  if (isValidating) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated or token is invalid
  if (!isAuthenticated || !isValid) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
