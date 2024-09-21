import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import the calendar's CSS
import './home.css';
import Sidebar from './Sidebar'; // Import Sidebar component
import { FaMicrophone } from 'react-icons/fa'; // Import mic icon from react-icons

function Home() {
  const [selectedDate, setSelectedDate] = useState();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [day, setDay] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');

  // Mark getSummary as async to allow usage of await
  const getSummary = async (text) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer aa`, // Replace with your OpenAI API key
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
                {"role": "system", "content": "You are a helpful assistant that summarizes nurse's daily actions. Format the summary as follows: 1) Patient's name or 'undetermined', 2) Other nurses involved or 'I completed this action on my own', 3) A bullet list of actions performed."},
                {"role": "user", "content": `Please summarize the following text in the specified format:${text}`}
            ],
          max_tokens: 150,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setSummary(data.choices[0].message.content.trim());
    } catch (error) {
      console.error('Error generating summary:', error);
      setSummary('An error occurred while generating the summary.');
    }
  };

  const startRecording = async () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
  
      recognition.onstart = () => {
        setIsRecording(true);
        console.log('Recording started');
      };
  
      recognition.onresult = (event) => {
        // Check if there are results and access them safely
        if (event.results && event.results[0] && event.results[0][0]) {
          const speechToText = event.results[0][0].transcript;
          setTranscript(speechToText); // Update the state
          console.log('Transcript: ', speechToText);
        }
      };
  
      recognition.onerror = (event) => {
        console.log('Error occurred in recognition: ', event.error);
      };
  
      recognition.onend = async (event) => {
        setIsRecording(false);
        console.log('Recording stopped');
        
        // Check if there are results before trying to access them
        if (event.results && event.results[0] && event.results[0][0]) {
          const finalTranscript = event.results[0][0].transcript;
          await getSummary(finalTranscript); // Pass final transcript to getSummary
        } else {
          console.log('No speech detected');
          setSummary('No speech was detected. Please try again.');
        }
      };
  
      recognition.start();
    } else {
      alert('Speech recognition not supported in this browser.');
    }
  };
  

  return (
    <div className='home'>
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <ul>
          <li>Home</li>
          <li>Weather</li>
          <li>Allergy Forecast</li>
        </ul>
      </div>
      <div className={`overlay ${sidebarOpen ? 'visible' : ''}`} onClick={() => setSidebarOpen(false)}></div>

      <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ position: 'fixed', top: '10px', left: '10px', zIndex: 1001 }}>
        ☰
      </button>
      <div className='header'>
        <h4 id='location'>Welcome</h4>
        <div id='date-scroller'></div>
      </div>
      <div className='box' id='Allergy'>
        <h2>Start Recording</h2>
        <button className="mic"onClick={startRecording} disabled={isRecording} style={{ padding: '10px', borderRadius: '50%', background: isRecording ? 'red' : 'green', border: 'none' }}>
          <FaMicrophone style={{ color: 'white', fontSize: '150px' }} />
        </button>
        <p>Transcript: {transcript}</p>
        <h2>Summary:</h2>
        <p>{summary}</p>
      </div>
    </div>
  );
}

export default Home;
