import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowed }: { children: React.ReactElement; allowed: number[] }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;
  if (!allowed.includes(user.level)) return <Navigate to="/unauthorized" />;
  return children;
};

export default ProtectedRoute;
