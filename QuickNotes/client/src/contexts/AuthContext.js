import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  // Initialize currentUser from localStorage if available
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Register with our backend
  async function register(username, email, password) {
    try {
      // Register with our backend
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username,
        email,
        password
      });
      
      // Save token to local storage
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      
      // Set current user and save to localStorage
      const userData = response.data.user || {
        email,
        displayName: username,
        username: username
      };
      setCurrentUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Login with our backend
  async function login(email, password) {
    try {
      // Generate username and display name from email
      const username = email.split('@')[0];
      const displayName = username.charAt(0).toUpperCase() + username.slice(1);
      
      // Generate profile photo URL
      const photoURL = `https://ui-avatars.com/api/?name=${displayName}&background=0D8ABC&color=fff`;
      
      // Store email in localStorage immediately
      localStorage.setItem('userEmail', email);
      
      // Login with our backend
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      
      // Save token to local storage
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      
      // Enhance user data with our local values
      let userData = response.data.user || {};
      userData = {
        ...userData,
        email: email,  // Use the email from the login form
        username: username,
        displayName: displayName,
        photoURL: photoURL
      };
      
      // Set current user and save to localStorage
      setCurrentUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Also store user data in base64 for the server to use
      // Using browser-compatible btoa instead of Node.js Buffer
      const userDataBase64 = btoa(JSON.stringify(userData));
      localStorage.setItem('userDataBase64', userDataBase64);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Logout
  async function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userDataBase64');
    setToken(null);
    setCurrentUser(null);
  }

  // Check if user is logged in on page load
  useEffect(() => {
    const checkLoggedIn = async () => {
      // First check if we have a user in localStorage
      const savedUser = localStorage.getItem('user');
      
      if (token) {
        // Set auth token for all requests
        axios.defaults.headers.common['x-auth-token'] = token;
        
        // If we have a saved user, set it immediately to prevent flashing login screen
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            setCurrentUser(parsedUser);
            
            // Add user data to headers if available
            const userDataBase64 = localStorage.getItem('userDataBase64');
            if (userDataBase64) {
              axios.defaults.headers.common['x-user-data'] = userDataBase64;
            } else {
              // Create it if it doesn't exist
              // Using browser-compatible btoa instead of Node.js Buffer
              const newUserDataBase64 = btoa(savedUser);
              localStorage.setItem('userDataBase64', newUserDataBase64);
              axios.defaults.headers.common['x-user-data'] = newUserDataBase64;
            }
            
            // Also add the user's email to headers
            const parsedUserEmail = parsedUser.email;
            if (parsedUserEmail) {
              axios.defaults.headers.common['x-user-email'] = parsedUserEmail;
              localStorage.setItem('userEmail', parsedUserEmail);
            }
          } catch (parseError) {
            console.error('Error parsing saved user:', parseError);
          }
        }
        
        // Then try to get fresh data from the server
        try {
          // Add email to headers if available
          const savedEmail = localStorage.getItem('userEmail');
          if (savedEmail) {
            axios.defaults.headers.common['x-user-email'] = savedEmail;
          }
          
          // Get user data from server
          const res = await axios.get('http://localhost:5000/api/auth/user');
          
          // Update current user with server data
          const userData = res.data;
          setCurrentUser(userData);
          
          // Update localStorage with latest user data
          localStorage.setItem('user', JSON.stringify(userData));
          
          // Update base64 user data for future requests
          // Using browser-compatible btoa instead of Node.js Buffer
          const updatedUserDataBase64 = btoa(JSON.stringify(userData));
          localStorage.setItem('userDataBase64', updatedUserDataBase64);
        } catch (err) {
          console.error('Error fetching user data:', err);
          // Only clear everything if we don't have a saved user
          if (!savedUser) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('userDataBase64');
            setToken(null);
            setCurrentUser(null);
          }
          // If we have a saved user, keep using it even if the server request fails
        }
      } else {
        // No token, clear user data
        setCurrentUser(null);
      }
      
      // Always set loading to false when done
      setLoading(false);
    };
    
    checkLoggedIn();
  }, [token]);

  const value = {
    currentUser,
    token,
    loading,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
