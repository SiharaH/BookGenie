import React, { Children } from 'react'
import { Navigate, useLocation } from 'react-router-dom';
import Spinner from '../Spinner';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = false;
  const loading = false;
  const location = useLocation();

  if (loading) {
    return <Spinner />; 
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute
