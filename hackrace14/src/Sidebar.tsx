import React from 'react';
import styled from 'styled-components';
import { X, Home, Cloud, Wind, Sun, Calendar,List } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SidebarContainerProps {
  isOpen: boolean;
}

const SidebarContainer = styled.div<SidebarContainerProps>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 280px;
  background-color: #2d3748;
  color: white;
  z-index: 1000;
  transition: transform 0.3s ease;
  transform: translateX(${props => props.isOpen ? '0' : '-100%'});
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
`;
const StyledLink = styled(Link)`
  color: inherit;  /* Inherit the color from the parent NavLink */
  text-decoration: none;

  &:visited {
    color: inherit;  /* Prevent visited links from changing color */
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  margin-top:100px
  background-color: #2c2f33;
`;

const SidebarTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #99aab5;
  cursor: pointer;
  font-size: 1.5rem;
  transition: color 0.2s ease;

  &:hover {
    color: white;
  }
`;

const SidebarNav = styled.nav`
  padding: 20px 0;
`;

const NavList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: 10px;
`;

const NavLink = styled.a`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  color: #99aab5;
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: #2c2f33;
    color: white;
  }

  svg {
    margin-right: 10px;
  }
`;

interface OverlayProps {
  isVisible: boolean;
}

const Overlay = styled.div<OverlayProps>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 900;
  display: ${props => props.isVisible ? 'block' : 'none'};
`;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      <SidebarContainer isOpen={isOpen}>
        <SidebarHeader>
          <SidebarTitle>Menu</SidebarTitle>
          <CloseButton onClick={onClose}>
            <X size={24} />
          </CloseButton>
        </SidebarHeader>
        <SidebarNav>
          <NavList>
            <NavItem>
              <NavLink >
                <Home size={20} />
                <StyledLink to="/">Home</StyledLink>
              </NavLink>
            </NavItem>
            {/* <NavItem>
              <NavLink href="#allergy">
                <Calendar size={20} />
                <StyledLink to="/Transcripts">Change Date</StyledLink>

              </NavLink>
            </NavItem> */}
            <NavItem>
              <NavLink href="#air">
                <List size={20} />
                <StyledLink to="/Transcripts">View Transcripts</StyledLink>

              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#metrics">
                <List size={20} />
                <StyledLink to="/metrics">Metrics</StyledLink>
              </NavLink>
            </NavItem>
          </NavList>
        </SidebarNav>
      </SidebarContainer>
      <Overlay isVisible={isOpen} onClick={onClose} />
    </>
  );
}

export default Sidebar;