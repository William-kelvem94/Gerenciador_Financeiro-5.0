import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
<<<<<<< HEAD
=======
// import { LoadingScreen } from '../ui/LoadingScreen';
>>>>>>> 19ae9cf82eb63c5cfccf5974311e9c254540a7d3
import { useAuthStore } from '../../stores/authStore';

export const AuthCallback: React.FC = () => {
  const { setUser } = useAuthStore();

  useEffect(() => {
    // Get token from URL params (Google OAuth callback)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      // Decode JWT to get user info (simplified)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const user = {
          id: payload.userId,
          email: payload.email,
          name: payload.name || payload.email,
          avatar: payload.avatar,
          createdAt: new Date().toISOString(),
        };
        
        setUser(user, token);
      } catch (error) {
        console.error('Failed to parse token:', error);
      }
    }
  }, [setUser]);

  return <Navigate to="/dashboard" replace />;
};