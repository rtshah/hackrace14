import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


import Home from './Home.tsx';
import Transcripts from './Transcripts.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Transcripts" element={<Transcripts />} />
      </Routes>
    </Router>
  );
}

export default App;
