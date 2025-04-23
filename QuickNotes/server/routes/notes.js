const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const auth = require('../middleware/auth');

// Mock notes for development without MongoDB
let mockNotes = [
  {
    _id: '1',
    title: 'Welcome to QuickNotes!',
    content: 'This is a sample note. You can create, edit, and organize your notes here.',
    color: '#f9d5e5',
    user: '123456789',
    isArchived: false,
    isDeleted: false,
    createdAt: new Date('2025-04-20T10:00:00'),
    updatedAt: new Date('2025-04-20T10:00:00')
  },
  {
    _id: '2',
    title: 'Shopping List',
    content: '- Milk\n- Eggs\n- Bread\n- Fruits',
    color: '#d5f9e5',
    user: '123456789',
    isArchived: false,
    isDeleted: false,
    createdAt: new Date('2025-04-20T11:00:00'),
    updatedAt: new Date('2025-04-20T11:00:00')
  },
  {
    _id: '3',
    title: 'Archived Note',
    content: 'This is an archived note for testing.',
    color: '#e5d5f9',
    user: '123456789',
    isArchived: true,
    isDeleted: false,
    createdAt: new Date('2025-04-20T12:00:00'),
    updatedAt: new Date('2025-04-20T12:00:00')
  },
  {
    _id: '4',
    title: 'Deleted Note',
    content: 'This is a deleted note for testing.',
    color: '#f9e5d5',
    user: '123456789',
    isArchived: false,
    isDeleted: true,
    createdAt: new Date('2025-04-20T13:00:00'),
    updatedAt: new Date('2025-04-20T13:00:00')
  },
  {
    _id: '5',
    title: 'Note with Reminder',
    content: 'Don\'t forget to check this!',
    color: '#d5e5f9',
    user: '123456789',
    isArchived: false,
    isDeleted: false,
    reminder: new Date('2025-04-22T09:00:00'),
    createdAt: new Date('2025-04-20T14:00:00'),
    updatedAt: new Date('2025-04-20T14:00:00')
  }
];

// Helper function to generate a unique ID
function generateId() {
  return Math.floor(Math.random() * 1000000).toString();
}

// @route   GET api/notes
// @desc    Get all notes for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // For development without MongoDB, filter mock notes
    const notes = mockNotes.filter(note => 
      note.user === req.user.id && 
      !note.isDeleted && 
      !note.isArchived
    ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/notes
// @desc    Create a note
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, content, color } = req.body;

  try {
    // For development without MongoDB, create a mock note
    const newNote = {
      _id: generateId(),
      title: title || 'Untitled',
      content: content || '',
      user: req.user.id,
      color: color || '#ffffff',
      isArchived: false,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add to mock notes
    mockNotes.unshift(newNote);
    res.json(newNote);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/notes/:id
// @desc    Update a note
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { title, content, color, isArchived, reminder } = req.body;

  try {
    // For development without MongoDB, find and update mock note
    const noteIndex = mockNotes.findIndex(note => note._id === req.params.id);
    
    if (noteIndex === -1) {
      return res.status(404).json({ msg: 'Note not found' });
    }
    
    const note = mockNotes[noteIndex];
    
    // Make sure user owns note
    if (note.user !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    // Update note fields
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (color !== undefined) note.color = color;
    if (isArchived !== undefined) note.isArchived = isArchived;
    if (reminder !== undefined) note.reminder = reminder;
    note.updatedAt = new Date();
    
    // Return updated note
    res.json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/notes/:id
// @desc    Move a note to trash (soft delete)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // For development without MongoDB, find and soft delete mock note
    const noteIndex = mockNotes.findIndex(note => note._id === req.params.id);
    
    if (noteIndex === -1) {
      return res.status(404).json({ msg: 'Note not found' });
    }
    
    const note = mockNotes[noteIndex];
    
    // Make sure user owns note
    if (note.user !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    // Soft delete - mark as deleted
    note.isDeleted = true;
    note.updatedAt = new Date();
    
    res.json({ msg: 'Note moved to trash' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/notes/permanent/:id
// @desc    Permanently delete a note
// @access  Private
router.delete('/permanent/:id', auth, async (req, res) => {
  try {
    // For development without MongoDB, find and permanently delete mock note
    const noteIndex = mockNotes.findIndex(note => note._id === req.params.id);
    
    if (noteIndex === -1) {
      return res.status(404).json({ msg: 'Note not found' });
    }
    
    const note = mockNotes[noteIndex];
    
    // Make sure user owns note
    if (note.user !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    // Hard delete - remove from array
    mockNotes.splice(noteIndex, 1);
    
    res.json({ msg: 'Note permanently deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/notes/trash
// @desc    Get all deleted notes
// @access  Private
router.get('/trash', auth, async (req, res) => {
  try {
    // For development without MongoDB, filter mock notes for trash
    const notes = mockNotes.filter(note => 
      note.user === req.user.id && 
      note.isDeleted
    ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/notes/restore/:id
// @desc    Restore a note from trash
// @access  Private
router.put('/restore/:id', auth, async (req, res) => {
  try {
    // For development without MongoDB, find and restore mock note
    const noteIndex = mockNotes.findIndex(note => note._id === req.params.id);
    
    if (noteIndex === -1) {
      return res.status(404).json({ msg: 'Note not found' });
    }
    
    const note = mockNotes[noteIndex];
    
    // Make sure user owns note
    if (note.user !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    // Restore from trash
    note.isDeleted = false;
    note.updatedAt = new Date();
    
    res.json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/notes/archived
// @desc    Get all archived notes
// @access  Private
router.get('/archived', auth, async (req, res) => {
  try {
    // For development without MongoDB, filter mock notes for archived
    const notes = mockNotes.filter(note => 
      note.user === req.user.id && 
      note.isArchived && 
      !note.isDeleted
    ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/notes/reminders
// @desc    Get all notes with reminders
// @access  Private
router.get('/reminders', auth, async (req, res) => {
  try {
    // For development without MongoDB, filter mock notes for reminders
    const notes = mockNotes.filter(note => 
      note.user === req.user.id && 
      note.reminder 
    ).sort((a, b) => new Date(a.reminder) - new Date(b.reminder));
    
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
