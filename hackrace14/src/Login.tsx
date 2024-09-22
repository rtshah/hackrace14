import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Component = () => {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  // Redirect the user to the home page if already authenticated
  if (isAuthenticated) {
    window.location.href = "/home";
    console.log("Redirecting to home page");
    return null;
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#2d3748', color: '#ffffff' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#2d3748',
      padding: '0 20px',
      textAlign: 'center'
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        color: '#ffffff'
      }}>
        Welcome to Vana AI
      </h1>
      <p style={{
        fontSize: '1.25rem',
        marginBottom: '2rem',
        color: '#e2e8f0',
        maxWidth: '400px'
      }}>
        AI powered nursing workflow optimization
      </p>
      <button 
        style={{
          backgroundColor: '#4299e1',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '16px 32px',
          fontSize: '1.125rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={() => loginWithRedirect()}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3182ce'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4299e1'}
      >
        Log In / Sign Up
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          style={{marginLeft: '8px', width: '20px', height: '20px'}}
        >
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>
    </div>
  );
};

export default Component;
