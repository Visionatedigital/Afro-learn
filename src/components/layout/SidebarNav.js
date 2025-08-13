import React from 'react';
import { FaBookOpen, FaChartBar, FaUser, FaChalkboardTeacher, FaCog, FaUsers, FaTools } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import './SidebarNav.css';

const SidebarNav = () => {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => 'sidebar-item' + (isActive ? ' active' : '')} end>
          <FaBookOpen className="sidebar-icon" />
          <span>My Courses</span>
        </NavLink>
        <NavLink to="/ubongo-tools" className={({ isActive }) => 'sidebar-item' + (isActive ? ' active' : '')}>
          <FaTools className="sidebar-icon" />
          <span>Ubongo Tools</span>
        </NavLink>
        <NavLink to="/progress" className={({ isActive }) => 'sidebar-item' + (isActive ? ' active' : '')}>
          <FaChartBar className="sidebar-icon" />
          <span>Progress</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => 'sidebar-item' + (isActive ? ' active' : '')}>
          <FaUser className="sidebar-icon" />
          <span>Profile</span>
        </NavLink>
        <NavLink to="/community" className={({ isActive }) => 'sidebar-item' + (isActive ? ' active' : '')}>
          <FaUsers className="sidebar-icon" />
          <span>Community</span>
        </NavLink>
        <NavLink to="/teachers" className={({ isActive }) => 'sidebar-item' + (isActive ? ' active' : '')}>
          <FaChalkboardTeacher className="sidebar-icon" />
          <span>Teachers/Mentors</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => 'sidebar-item' + (isActive ? ' active' : '')}>
          <FaCog className="sidebar-icon" />
          <span>Settings</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default SidebarNav;
