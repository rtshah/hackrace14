import { ArrowRight } from "lucide-react";
import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';

const Component: React.FC = () => {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  // Redirect the user to the home page if already authenticated
  if (isAuthenticated) {
    window.location.href = "/home";
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-white px-4">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Welcome to Our App</h1>
      <p className="text-xl text-center mb-8 text-gray-600 max-w-md">
        Join our community and start your journey today!
      </p>
      <button 
        className="flex items-center text-lg px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300" 
        onClick={() => loginWithRedirect()}
      >
        Log In / Sign Up
        <ArrowRight className="ml-2 h-5 w-5" />
      </button>
    </div>
  );
};

export default Component;
