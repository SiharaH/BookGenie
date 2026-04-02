import React, { Children } from 'react'
import { Navigate, useLocation } from 'react-router-dom';
import Spinner from '../Spinner';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Spinner />; 
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute
