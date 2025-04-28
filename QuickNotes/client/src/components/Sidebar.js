import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaArchive, FaTrash, FaBell, FaSignOutAlt, FaUser, FaMoon, FaSun } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Sidebar = () => {
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-16 m-0 flex flex-col bg-gray-100 dark:bg-gray-900 text-white shadow-lg">
      <NavLink to="/profile" className={({ isActive }) => isActive ? "text-green-500" : ""}>
        <div className="sidebar-icon mt-4">
          {currentUser?.photoURL ? (
            <img 
              src={currentUser.photoURL} 
              alt="Profile" 
              className="rounded-full h-8 w-8"
            />
          ) : (
            <FaUser size="20" />
          )}
          <span className="sidebar-tooltip">Profile</span>
        </div>
      </NavLink>

      <NavLink to="/" className={({ isActive }) => isActive ? "text-green-500" : ""}>
        <div className="sidebar-icon">
          <FaHome size="20" />
          <span className="sidebar-tooltip">Home</span>
        </div>
      </NavLink>

      <NavLink to="/archived" className={({ isActive }) => isActive ? "text-green-500" : ""}>
        <div className="sidebar-icon">
          <FaArchive size="20" />
          <span className="sidebar-tooltip">Archived</span>
        </div>
      </NavLink>

      <NavLink to="/reminders" className={({ isActive }) => isActive ? "text-green-500" : ""}>
        <div className="sidebar-icon">
          <FaBell size="20" />
          <span className="sidebar-tooltip">Reminders</span>
        </div>
      </NavLink>

      <NavLink to="/trash" className={({ isActive }) => isActive ? "text-green-500" : ""}>
        <div className="sidebar-icon">
          <FaTrash size="20" />
          <span className="sidebar-tooltip">Trash</span>
        </div>
      </NavLink>

      <div className="mt-auto"></div>
      
      <div className="sidebar-icon" onClick={toggleDarkMode}>
        {darkMode ? <FaSun size="20" /> : <FaMoon size="20" />}
        <span className="sidebar-tooltip">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
      </div>

      <div className="sidebar-icon mb-4" onClick={handleLogout}>
        <FaSignOutAlt size="20" />
        <span className="sidebar-tooltip">Logout</span>
      </div>
    </div>
  );
};

export default Sidebar;
