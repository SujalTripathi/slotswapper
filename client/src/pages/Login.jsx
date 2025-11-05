import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
  const { user } = useAuth();

  if (user?.isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default Login;