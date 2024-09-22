import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import Home from './Home.tsx';
import Transcripts from './Transcripts.tsx';
import Metrics from './Metrics.tsx';
import Login from './Login.tsx';  

function App() {
  return (
    <Auth0Provider
      domain="dev-uew5gflpuav8725n.us.auth0.com"
      clientId="2KCRfIasmjgsawGTg92O7bIiAhC6hDGG"
      authorizationParams={{ redirect_uri: window.location.origin + '/home' }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<Login />} /> {/* Login page */}
          <Route path="/home" element={<Home />} /> {/* Protected home page */}
          <Route path="/transcripts" element={<Transcripts />} />
          <Route path="/metrics" element={<Metrics />} />
        </Routes>
      </Router>
    </Auth0Provider>
  );
}

export default App;
