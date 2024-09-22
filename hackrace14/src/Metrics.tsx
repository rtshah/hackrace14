import React, { useState } from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar.tsx'; // Import Sidebar component
import { Menu } from 'lucide-react'; // Import icon for sidebar toggle
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

const RecommendationBox = styled.div`
  background-color: #2d3748;
  border-radius: 10px;
  padding: 20px;
  margin-top: 20px;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const RecommendationItem = styled.div`
  margin-bottom: 15px;
  color: #cbd5e0;
`;

function Metrics() {
  const [sidebarOpen, setSidebarOpen] = useState(false); 
  const data = {
    labels: ['Patient A', 'Patient B', 'Patient C', 'Patient D', 'Patient E'],
    datasets: [
      {
        label: 'Need Level (1-10)',
        data: [3, 7, 5, 8, 6], // Fake need levels
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        title: {
          display: true,
          text: 'Need Level',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Patients',
        },
      },
    },
  };

  const recommendations = [
    {
      hall: 'Hall 1',
      nurse: 'Nurse A',
      patients: ['Patient B', 'Patient D'], // Higher need patients
    },
    {
      hall: 'Hall 2',
      nurse: 'Nurse B',
      patients: ['Patient A', 'Patient C', 'Patient E'], // Lower to moderate need patients
    },
  ];

  return (
    <MetricsContainer>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <Header>
        <SidebarToggle onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu />
        </SidebarToggle>
        <HeaderTitle>Metrics</HeaderTitle>
        <div style={{ width: '24px' }} /> {/* Placeholder for symmetry */}
      </Header>

      <MainContent>
        <h2>Patient Need Levels</h2>
        <p>Here is a chart representing patient need levels on a scale of 1 to 10:</p>
        <Bar data={data} options={options} />
        <RecommendationBox>
          <h3>Nurse Allocation Recommendations</h3>
          {recommendations.map((rec, index) => (
            <RecommendationItem key={index}>
              <strong>{rec.hall}:</strong> {rec.nurse} should be assigned to patients {rec.patients.join(', ')}.
            </RecommendationItem>
          ))}
        </RecommendationBox>
      </MainContent>
    </MetricsContainer>
  );
}

export default Metrics;
