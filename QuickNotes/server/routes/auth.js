const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Mock user for development without MongoDB
const mockUser = {
  id: '123456789',
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123',
  photoURL: 'https://ui-avatars.com/api/?name=Test+User&background=0D8ABC&color=fff',
  displayName: 'Test User',
  bio: 'This is a demo account for QuickNotes application.',
  createdAt: new Date('2025-01-01')
};

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // For development without MongoDB, always succeed with mock user
    console.log('Registering mock user:', { username, email });
    
    // Create JWT payload
    const payload = {
      user: {
        id: mockUser.id
      }
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token,
          user: { 
            id: mockUser.id, 
            username: username || mockUser.username, 
            email: email || mockUser.email,
            photoURL: mockUser.photoURL,
            displayName: username || mockUser.displayName,
            bio: mockUser.bio,
            createdAt: new Date()
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Accept any login for demo purposes
    console.log('Mock login successful for:', email);
    
    // Generate a username and display name from the email
    const username = email.split('@')[0];
    const displayName = username.charAt(0).toUpperCase() + username.slice(1);
    
    // Generate a profile photo URL based on the display name
    const photoURL = `https://ui-avatars.com/api/?name=${displayName}&background=0D8ABC&color=fff`;
    
    // Create JWT payload
    const payload = {
      user: {
        id: mockUser.id
      }
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token, 
          user: { 
            id: mockUser.id, 
            username: username, 
            email: email,
            photoURL: photoURL,
            displayName: displayName,
            bio: "I'm using QuickNotes to organize my thoughts and tasks.",
            createdAt: new Date()
          } 
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    // In a real app, we would fetch the user from the database
    // For our demo, we'll return user data based on the token
    
    // Since we don't have a real database, we'll generate user info from the token
    // This would normally be stored in the database
    const userId = req.user.id;
    
    // Get stored user data from the token (in a real app, this would come from the database)
    const storedUserData = req.header('x-user-data');
    
    if (storedUserData) {
      try {
        // If we have stored user data in the header, use it
        // Handle both Node.js Buffer and browser btoa encoding
        let userData;
        try {
          // Try browser btoa format first
          userData = JSON.parse(atob(storedUserData));
        } catch (e) {
          // Fall back to Node.js Buffer format
          userData = JSON.parse(Buffer.from(storedUserData, 'base64').toString());
        }
        res.json(userData);
        return;
      } catch (parseError) {
        console.error('Error parsing user data:', parseError);
        // Continue with default data if parsing fails
      }
    }
    
    // Get email from headers if available
    const email = req.header('x-user-email') || 'user@example.com';
    
    // Generate username and display name from email
    const username = email.split('@')[0];
    const displayName = username.charAt(0).toUpperCase() + username.slice(1);
    
    // Generate profile photo URL
    const photoURL = `https://ui-avatars.com/api/?name=${displayName}&background=0D8ABC&color=fff`;
    
    // Return user data
    res.json({
      _id: userId,
      username: username,
      email: email,
      photoURL: photoURL,
      displayName: displayName,
      bio: "I'm using QuickNotes to organize my thoughts and tasks.",
      createdAt: new Date()
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
