import React, { useState, useRef, useEffect } from 'react';
import DateSelector from './DateSelector.tsx';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Sidebar from './Sidebar.tsx';
import db from "./firebase";
import { collection, onSnapshot, addDoc } from 'firebase/firestore'; 
import { Menu, X, Download } from 'lucide-react'
import styled from 'styled-components'
import { FaMicrophone } from 'react-icons/fa'

const HomeContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom right, #1a202c, #2d3748);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`

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
`

const HeaderTitle = styled.h1`
  font-size: 1.2rem;
  margin: 0;
`

const MainBox = styled.div`
  background-color: #2d3748;
  border-radius: 10px;
  padding: 30px;
  width: 80%;
  max-width: 800px;
  margin-top: 70px;
  box-shadow: 10px 10px 10px 2px rgba(0, 0, 0, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Button = styled.button`
  background-color: ${props => props.isRecording ? '#e53e3e' : '#38a169'};
  color: white;
  border: none;
  border-radius: 50%;
  width: 200px;
  height: 200px;
  font-size: 100px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;

  &:hover {
    background-color: ${props => props.isRecording ? '#c53030' : '#2f855a'};
  }
`

const TextBox = styled.div`
  background-color: #4a5568;
  border-radius: 5px;
  padding: 15px;
  margin-top: 20px;
  width: 95%;


`

const DownloadButton = styled.button`
  background-color: #3182ce;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  margin-top: 25px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2c5282;
  }
`

const SidebarToggle = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
`

function Home() {
  const [selectedDate, setSelectedDate] = useState();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [day, setDay] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [summaries, setSummaries] = useState([]);
  const [colors, setColors] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const recognitionRef = useRef(null);
  const formatDateToUTC = (date: Date): string => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const handleDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
  };
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "colors"), (snapshot) => {
      const colorsArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setColors(colorsArray); 
    });

    return () => unsubscribe(); 
  }, []); 

  const saveSummaryToFirestore = async (summaryText) => {
    try {
      await addDoc(collection(db, 'summaries'), {
        transcript,
        summary: summaryText,
        timestamp: new Date(),
      });
      console.log('Summary saved to Firestore');
    } catch (error) {
      console.error('Error saving summary to Firestore:', error);
    }
  };

  const getSummary = async (text) => {
    try {
      const formattedDate = formatDateToUTC(currentDate);
      const response = await fetch(`http://localhost:5000/api/summarize/${formattedDate}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const summaryText = data.summary;
      setSummary(summaryText);

      await saveSummaryToFirestore(summaryText);
    } catch (error) {
      console.error('Error fetching summary:', error);
      setSummary('An error occurred while generating the summary.');
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setIsRecording(false);
      }
    } else {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;  
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
    
        recognition.onstart = () => {
          setIsRecording(true);
          console.log('Recording started');
        };
    
        recognition.onresult = (event) => {
          if (event.results && event.results[0] && event.results[0][0]) {
            const speechToText = event.results[0][0].transcript;
            setTranscript(speechToText);
            console.log('Transcript: ', speechToText);

            recognitionRef.current.finalTranscript = speechToText;  
          }
        };
    
        recognition.onerror = (event) => {
          console.log('Error occurred in recognition: ', event.error);
        };
    
        recognition.onend = async () => {
          setIsRecording(false);
          console.log('Recording stopped');
          
          const finalTranscript = recognitionRef.current.finalTranscript;

          if (finalTranscript) {
            await getSummary(finalTranscript);
          } else {
            console.log('No speech detected');
            setSummary('No speech was detected. Please try again.');
          }
        };
    
        recognition.start();
      } else {
        alert('Speech recognition not supported in this browser.');
      }
    }
  };

  const generateCSV = () => {
    const csvHeader = ['Patient Name', 'Two Assist', 'Took Shower', 'Other Details'];
    const csvRows = summaries.map((summary) => [
      'John Doe',
      summary.summary.includes('two assist') ? 'Yes' : 'No',
      summary.summary.includes('shower') ? 'Yes' : 'No',
      summary.summary, 
    ]);

    const csvContent = [csvHeader, ...csvRows]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'patient_summary.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  return (
    <HomeContainer>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header>
        <SidebarToggle onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu />
        </SidebarToggle>
        <HeaderTitle>Welcome</HeaderTitle>
        <div style={{ width: '24px' }} /> {/* Placeholder for symmetry */}
      </Header>

      <MainBox>
      <DateSelector currentDate={currentDate} onDateChange={handleDateChange} />

        <h2>{isRecording ? 'Recording...' : 'Start Recording'}</h2>
        <Button isRecording={isRecording} onClick={toggleRecording}>
          <FaMicrophone />
        </Button>
        <TextBox>
          <h3>Transcript:</h3>
          <p>{transcript || 'No transcript available'}</p>
        </TextBox>
        <TextBox>
          <h3>Summary:</h3>
          <p>{summary || 'No summary available'}</p>
        </TextBox>
        <DownloadButton onClick={generateCSV}>
          Download CSV
        </DownloadButton>
      </MainBox>
    </HomeContainer>
  );
}

export default Home;