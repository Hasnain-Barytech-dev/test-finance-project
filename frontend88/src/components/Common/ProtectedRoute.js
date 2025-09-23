import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loading from './Loading';

const ProtectedRoute = ({ children }) => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return <Loading text="Authenticating..." />;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
