import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SignupForm from '../components/auth/SignupForm';

const Signup = () => {
  const { user } = useAuth();

  if (user?.isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div>
      <SignupForm />
    </div>
  );
};

export default Signup;