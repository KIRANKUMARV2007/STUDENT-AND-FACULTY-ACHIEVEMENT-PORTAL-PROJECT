import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar d-flex flex-column">
      <div className="sidebar-header p-4">
        <h3 className="mb-0 text-primary fw-bold">Achievement Portal</h3>
        <small className="text-muted fw-semibold">Academic Excellence</small>
      </div>
      
      <div className="sidebar-menu flex-grow-1 px-3">
        <ul className="nav flex-column">
          <li className="nav-item">
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <i className="bi bi-grid-1x2"></i> Dashboard
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/my-achievements" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <i className="bi bi-award"></i> My Achievements
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/add-achievement" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <i className="bi bi-plus-circle"></i> Add Achievement
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/reward-points" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <i className="bi bi-star"></i> Reward Points
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/leaderboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <i className="bi bi-bar-chart-steps"></i> Leaderboard
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/student-search" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <i className="bi bi-search"></i> Student Search
            </NavLink>
          </li>
          <li className="nav-item mt-3">
            <NavLink to="/notifications" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <i className="bi bi-bell"></i> Notifications
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="sidebar-footer p-3">
        <ul className="nav flex-column">
          <li className="nav-item">
            <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <i className="bi bi-gear"></i> Settings
            </NavLink>
          </li>
          <li className="nav-item mt-2">
            <NavLink to="/" className="nav-link text-danger logout-btn">
              <i className="bi bi-box-arrow-right"></i> Logout
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
