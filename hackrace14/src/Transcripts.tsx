import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Menu, RefreshCw, X, Edit2, Check, Download, Loader } from 'lucide-react';
import Sidebar from './Sidebar.tsx';
import OpenAI from "openai";

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
  const [isDownloading, setIsDownloading] = useState(false); // New state for download

  const fetchSummaries = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/documents');
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

  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true 
  });

  const downloadCSV = async () => {
    setIsDownloading(true); // Set loading to true
    // Check if API key is present
    if (!process.env.REACT_APP_OPENAI_API_KEY) {
      console.error('API key is missing!');
      return;
    }
  
    // Prepare summaries as a text block to be processed by OpenAI
    const summaryTexts = summaries.map(summary => summary.summary).join("\n\n");
  
    const openaiPrompt = `
      You are given a set of summaries in the format: "1)... 2)... 3)...".
      1) Refers to patient information, 2) Refers to nurses, and 3) Refers to actions.
  
      Ignore summaries that don't contain a specific patient (for example, "1) undetermined" should be ignored).
  
      Here are the summaries:
      ${summaryTexts}
  
      Return the results in CSV format with columns "Patient", "Nurses", "Actions".
      Do not return any other text. Only return the CSV data.
      If there are multiple nurses, separate them with / (forward slash).
    `;
  
    try {
      // First request to OpenAI for the initial CSV generation
      const firstCompletion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: openaiPrompt },
        ],
      });
  
      // Get the CSV text from the response
      const csvData = firstCompletion.choices[0].message.content.trim();
  
      // Second request: Ask OpenAI to combine rows for the same patient
      const combinePrompt = `
        You are given a CSV with columns "Patient", "Nurses", and "Actions".
        Combine rows where the patient is the same by combining their corresponding "Nurses" and "Actions".
        Combine the nurses together appropriately, separating each of them by / (forward slash), and concatenate the actions appropriately.
        Do not leave duplicate nurses or actions in the final output.
  
        Here's the CSV:
        ${csvData}
  
        Return the results as CSV format. Do not return any other text. Only return the CSV data.
      `;
  
      const secondCompletion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: combinePrompt },
        ],
      });
  
      // Get the final CSV with combined rows from the second response
      const finalCsvData = secondCompletion.choices[0].message.content.trim();
  
      // Prepare the final CSV file for download
      const csvContent = 'data:text/csv;charset=utf-8,' + finalCsvData;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'summaries.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating CSV with OpenAI API:', error);
    } finally {
      setIsDownloading(false); // Reset loading state
    }
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
          <DownloadButton onClick={downloadCSV} disabled={isDownloading}>
            {isDownloading ? (
              <>
                <Loader size={18} className="spinning" /> Generating CSV...
              </>
            ) : (
              <>
                <Download size={18} /> Download CSV of All Summaries
              </>
            )}
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
