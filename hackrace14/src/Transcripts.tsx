import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Menu, RefreshCw } from 'lucide-react';
import Sidebar from './Sidebar.tsx';

const PageContainer = styled.div`
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

const SidebarToggle = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
`;

const MainContent = styled.main`
  width: 100%;
  max-width: 800px;
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SummaryBox = styled.div`
  background-color: #2d3748;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }
`;

const RefreshButton = styled.button`
  background-color: #4a5568;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  margin-bottom: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #2c5282;
  }

  svg {
    margin-right: 8px;
  }
`;

const LoadingMessage = styled.p`
  font-size: 1.2rem;
  text-align: center;
`;

const ErrorMessage = styled.p`
  font-size: 1.2rem;
  text-align: center;
  color: #fc8181;
`;

export default function Transcripts() {
  const [summaries, setSummaries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchSummaries = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/documents');
      if (!response.ok) {
        throw new Error('Failed to fetch summaries');
      }
      const data = await response.json();
      setSummaries(data);
    } catch (err) {
      setError('An error occurred while fetching the summaries. Please try again.');
      console.error('Error fetching summaries:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaries();
  }, []);

  return (
    <PageContainer>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header>
        <SidebarToggle onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu />
        </SidebarToggle>
        <HeaderTitle>Todays Actions</HeaderTitle>
        <div style={{ width: '24px' }} /> {/* Placeholder for symmetry */}
      </Header>
      <MainContent>
        <RefreshButton onClick={fetchSummaries}>
          <RefreshCw size={18} />
          Refresh Actions
        </RefreshButton>
        {isLoading ? (
          <LoadingMessage>Loading summaries...</LoadingMessage>
        ) : error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : summaries.length === 0 ? (
          <LoadingMessage>No summaries found.</LoadingMessage>
        ) : (
          summaries.map((summary, index) => (
            <SummaryBox key={index}>
              <p>{summary}</p>
            </SummaryBox>
          ))
        )}
      </MainContent>
    </PageContainer>
  );
}