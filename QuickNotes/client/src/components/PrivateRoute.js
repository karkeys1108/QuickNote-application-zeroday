import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaSpinner } from 'react-icons/fa';

const PrivateRoute = () => {
  const { currentUser, token, loading } = useAuth();
  
  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <FaSpinner className="animate-spin text-green-500 text-4xl" />
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!currentUser || !token) {
    return <Navigate to="/login" />;
  }
  
  // If authenticated, render the child routes
  return <Outlet />;
};

export default PrivateRoute;
