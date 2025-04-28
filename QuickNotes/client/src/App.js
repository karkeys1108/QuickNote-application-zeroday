import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotesProvider } from './contexts/NotesContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ArchivedNotes from './pages/ArchivedNotes';
import Trash from './pages/Trash';
import Reminders from './pages/Reminders';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <NotesProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/" element={<Home />} />
                <Route path="/archived" element={<ArchivedNotes />} />
                <Route path="/trash" element={<Trash />} />
                <Route path="/reminders" element={<Reminders />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
              
              {/* Redirect any unknown routes to home */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </NotesProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
