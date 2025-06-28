import React from 'react';
import { Toaster } from 'react-hot-toast';

const Toast: React.FC = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        // Default options for all toasts
        duration: 4000,
        style: {
          background: '#1f2937', // gray-800
          color: '#ffffff',
          border: '1px solid #10b981', // green-500
          borderRadius: '0.5rem',
          fontSize: '14px',
          fontWeight: '500',
        },
        // Success toasts
        success: {
          duration: 3000,
          style: {
            background: '#065f46', // green-800
            border: '1px solid #10b981', // green-500
            color: '#d1fae5', // green-100
          },
          iconTheme: {
            primary: '#10b981', // green-500
            secondary: '#065f46', // green-800
          },
        },
        // Error toasts
        error: {
          duration: 5000,
          style: {
            background: '#7f1d1d', // red-800
            border: '1px solid #ef4444', // red-500
            color: '#fecaca', // red-200
          },
          iconTheme: {
            primary: '#ef4444', // red-500
            secondary: '#7f1d1d', // red-800
          },
        },
        // Loading toasts
        loading: {
          style: {
            background: '#1e3a8a', // blue-800
            border: '1px solid #3b82f6', // blue-500
            color: '#dbeafe', // blue-100
          },
          iconTheme: {
            primary: '#3b82f6', // blue-500
            secondary: '#1e3a8a', // blue-800
          },
        },
      }}
      containerStyle={{
        top: 80, // Account for header
      }}
    />
  );
};

export default Toast;
