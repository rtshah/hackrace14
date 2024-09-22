import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Menu, RefreshCw, X, Edit2, Check, Download } from 'lucide-react';
import Sidebar from './Sidebar.tsx';
import DateSelector from './DateSelector.tsx';
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
  width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
  position: relative;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #a0aec0;
  cursor: pointer;
  transition: color 0.2s ease;
  margin-left: 10px;

  &:hover {
    color: #fff;
  }
`;

const ButtonGroup = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
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

const DownloadButton = styled.button`
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

const EditInput = styled.textarea`
  width: 100%;
  background-color: #4a5568;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px;
  margin-top: 10px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
`;

interface Summary {
  id: string;
  summary: string;
}

export default function SummaryList() {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());

  const fetchSummaries = async (date: Date) => {
    setIsLoading(true);
    setError(null);
    try {
      const formattedDate = formatDateToUTC(date);
      const response = await fetch(`http://localhost:5000/api/documents/${formattedDate}`);
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
  const formatDateToUTC = (date: Date): string => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  useEffect(() => {
    fetchSummaries(currentDate);
  }, [currentDate]);

  const handleDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
  };
  const deleteSummary = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/summary/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete summary');
      }

      setSummaries(summaries.filter(summary => summary.id !== id));
    } catch (err) {
      setError('An error occurred while deleting the summary. Please try again.');
      console.error('Error deleting summary:', err);
    }
  };

  const startEditing = (id: string, content: string) => {
    setEditingId(id);
    setEditContent(content);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditContent('');
  };

  const saveEdit = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/summary/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ summary: editContent }),
      });

      if (!response.ok) {
        throw new Error('Failed to update summary');
      }

      setSummaries(summaries.map(summary => 
        summary.id === id ? { ...summary, summary: editContent } : summary
      ));
      setEditingId(null);
      setEditContent('');
    } catch (err) {
      setError('An error occurred while updating the summary. Please try again.');
      console.error('Error updating summary:', err);
    }
  };

  const downloadCSV = () => {
    // Create the CSV header
    let csvContent = 'data:text/csv;charset=utf-8,Patient,Nurses,Actions\n';
  
    // Process each summary and extract relevant data
    summaries.forEach(summary => {
      // Match the "1)", "2)", and "3)" pattern using a regular expression
      const match = summary.summary.match(/1\)([^2]*)2\)([^3]*)3\)(.*)/s);
  
      if (match) {
        const patient = match[1].trim().replace(/\n/g, ' '); // Clean up newlines in "Patient" section
        const nurses = match[2].trim().replace(/\n/g, ' ');  // Clean up newlines in "Nurses" section
        const actions = match[3].trim().replace(/\n/g, ' '); // Clean up newlines in "Actions" section
  
        // Append the row to CSV content
        csvContent += `"${patient}","${nurses}","${actions}"\n`;
      }
    });
  
    // Encode the CSV content and trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'summaries.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };  

  return (
    <PageContainer>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header>
        <SidebarToggle onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu />
        </SidebarToggle>
        <HeaderTitle>Actions List</HeaderTitle>
        <div style={{ width: '24px' }} />
      </Header>
      <MainContent>
        <ButtonContainer>
          
          <RefreshButton onClick={fetchSummaries}>
            <RefreshCw size={18} />
            Refresh Summaries
          </RefreshButton>
      <DateSelector currentDate={currentDate} onDateChange={handleDateChange} />

          <DownloadButton onClick={downloadCSV}>
            <Download size={18} />
            Download CSV of All Summaries
          </DownloadButton>
        </ButtonContainer>
        {isLoading ? (
          <LoadingMessage>Loading summaries...</LoadingMessage>
        ) : error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : summaries.length === 0 ? (
          <LoadingMessage>No summaries found.</LoadingMessage>
        ) : (
          summaries.map((summary) => (
            <SummaryBox key={summary.id}>
              <ButtonGroup>
                {editingId === summary.id ? (
                  <>
                    <ActionButton onClick={() => saveEdit(summary.id)}>
                      <Check size={18} />
                    </ActionButton>
                    <ActionButton onClick={cancelEditing}>
                      <X size={18} />
                    </ActionButton>
                  </>
                ) : (
                  <>
                    <ActionButton onClick={() => startEditing(summary.id, summary.summary)}>
                      <Edit2 size={18} />
                    </ActionButton>
                    <ActionButton onClick={() => deleteSummary(summary.id)}>
                      <X size={18} />
                    </ActionButton>
                  </>
                )}
              </ButtonGroup>
              {editingId === summary.id ? (
                <EditInput
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
              ) : (
                <p>{summary.summary}</p>
              )}
            </SummaryBox>
          ))
        )}
      </MainContent>
    </PageContainer>
  );
}
