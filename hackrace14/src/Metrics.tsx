import React, { useState } from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar.tsx'; // Import Sidebar component
import { Menu } from 'lucide-react'; // Import icon for sidebar toggle

const MetricsContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom right, #1a202c, #2d3748);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Header = styled.header`
  background-color: #2d3748;
  width: 100%;
  padding: 10px 15px;
  text-align: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderTitle = styled.h1`
  font-size: 1.2rem;
  margin: 0;
`;

const MainContent = styled.main`
  width: 100%;
  max-width: 800px;
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SidebarToggle = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
`;

function Metrics() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar state

  return (
    <MetricsContainer>
      {/* Include Sidebar component */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <Header>
        <SidebarToggle onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu />
        </SidebarToggle>
        <HeaderTitle>Metrics</HeaderTitle>
        <div style={{ width: '24px' }} /> {/* Placeholder for symmetry */}
      </Header>

      <MainContent>
        <h2>Metrics Page</h2>
        <p>Here you can display various metrics...</p>
      </MainContent>
    </MetricsContainer>
  );
}

export default Metrics;
