import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Login: React.FC = () => {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  // Redirect the user to the home page if already authenticated
  if (isAuthenticated) {
    window.location.href = "/home";
    console.log("Redirecting to home page");
    return null;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <h1>Welcome</h1>
        <p>Please log in to access the app</p>
        <button onClick={() => loginWithRedirect()}>
          Log In / Sign Up
        </button>
      </div>
    </div>
  );
};

export default Login;
