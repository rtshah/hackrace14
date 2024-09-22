import React from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DateSelectorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  background-color: #2d3748;
  padding: 10px;
  border-radius: 8px;
`;

const DateDisplay = styled.div`
  font-size: 1.2rem;
  margin: 0 15px;
`;

const DateButton = styled.button`
  background: none;
  border: none;
  color: #a0aec0;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #fff;
  }
`;

interface DateSelectorProps {
  currentDate: Date;
  onDateChange: (newDate: Date) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ currentDate, onDateChange }) => {
  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    onDateChange(newDate);
  };

  return (
    <DateSelectorContainer>
      <DateButton onClick={() => changeDate(-1)}>
        <ChevronLeft size={24} />
      </DateButton>
      <DateDisplay>
        {currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      </DateDisplay>
      <DateButton onClick={() => changeDate(1)}>
        <ChevronRight size={24} />
      </DateButton>
    </DateSelectorContainer>
  );
};

export default DateSelector;