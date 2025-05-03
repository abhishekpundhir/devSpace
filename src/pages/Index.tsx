
import React from 'react';
import { Navigate } from 'react-router-dom';

const Index = () => {
  // In a real app, we'd check if the user is authenticated
  // and redirect accordingly
  return <Navigate to="/dashboard" replace />;
};

export default Index;
