// src/Sidebar.js
import React from 'react';
import './sidebar.css';

function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? 'Close' : 'Open'} Menu
      </button>
      {isOpen && (
        <div>
          <h2>Menu</h2>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#allergy">Allergy Forecast</a></li>
            <li><a href="#air">Air Quality</a></li>
            <li><a href="#weather">Weather</a></li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Sidebar;