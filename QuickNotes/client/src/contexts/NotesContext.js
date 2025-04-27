import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const NotesContext = createContext();

export function useNotes() {
  return useContext(NotesContext);
}

export function NotesProvider({ children }) {
  const { token } = useAuth();
  const [notes, setNotes] = useState([]);
  const [archivedNotes, setArchivedNotes] = useState([]);
  const [trashedNotes, setTrashedNotes] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Configure axios with auth token
  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Add token to requests if available
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['x-auth-token'] = token;
    } else {
      delete api.defaults.headers.common['x-auth-token'];
    }
  }, [token]);

  // Fetch all notes
  const fetchNotes = useCallback(async () => {
    if (!token) {
      setNotes([]);
      return;
    }
    
    try {
      const res = await api.get('/notes');
      setNotes(res.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Failed to fetch notes');
    }
  }, [token, api]);

  // Fetch archived notes
  const fetchArchivedNotes = useCallback(async () => {
    if (!token) {
      setArchivedNotes([]);
      return;
    }
    
    try {
      const res = await api.get('/notes/archived');
      setArchivedNotes(res.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching archived notes:', err);
      setError('Failed to fetch archived notes');
    }
  }, [token, api]);

  // Fetch trashed notes
  const fetchTrashedNotes = useCallback(async () => {
    if (!token) {
      setTrashedNotes([]);
      return;
    }
    
    try {
      const res = await api.get('/notes/trash');
      setTrashedNotes(res.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching trashed notes:', err);
      setError('Failed to fetch trashed notes');
    }
  }, [token, api]);

  // Fetch notes with reminders
  const fetchReminders = useCallback(async () => {
    if (!token) {
      setReminders([]);
      return;
    }
    
    try {
      const res = await api.get('/notes/reminders');
      setReminders(res.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching reminders:', err);
      setError('Failed to fetch reminders');
    }
  }, [token, api]);

  // Create a new note
  const createNote = async (noteData) => {
    setLoading(true);
    try {
      const res = await api.post('/notes', noteData);
      setNotes(prevNotes => [res.data, ...prevNotes]);
      setError(null);
      return res.data;
    } catch (err) {
      console.error('Error creating note:', err);
      setError('Failed to create note');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update a note
  const updateNote = async (id, noteData) => {
    setLoading(true);
    try {
      const res = await api.put(`/notes/${id}`, noteData);
      
      // Update the appropriate notes array based on the note's status
      if (res.data.isArchived) {
        setArchivedNotes(prevNotes => 
          prevNotes.map(note => note._id === id ? res.data : note)
        );
        setNotes(prevNotes => prevNotes.filter(note => note._id !== id));
      } else {
        setNotes(prevNotes => 
          prevNotes.map(note => note._id === id ? res.data : note)
        );
        setArchivedNotes(prevNotes => prevNotes.filter(note => note._id !== id));
      }
      
      setError(null);
      return res.data;
    } catch (err) {
      console.error('Error updating note:', err);
      setError('Failed to update note');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Move a note to trash (soft delete)
  const trashNote = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/notes/${id}`);
      
      // Remove from active or archived notes and add to trashed
      const noteToTrash = [...notes, ...archivedNotes].find(note => note._id === id);
      if (noteToTrash) {
        setTrashedNotes(prevNotes => [{...noteToTrash, isDeleted: true}, ...prevNotes]);
      }
      
      setNotes(prevNotes => prevNotes.filter(note => note._id !== id));
      setArchivedNotes(prevNotes => prevNotes.filter(note => note._id !== id));
      
      setError(null);
      return true;
    } catch (err) {
      console.error('Error trashing note:', err);
      setError('Failed to trash note');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Restore a note from trash
  const restoreNote = async (id) => {
    setLoading(true);
    try {
      const res = await api.put(`/notes/restore/${id}`);
      
      // Remove from trashed notes and add back to appropriate list
      setTrashedNotes(prevNotes => prevNotes.filter(note => note._id !== id));
      
      if (res.data.isArchived) {
        setArchivedNotes(prevNotes => [res.data, ...prevNotes]);
      } else {
        setNotes(prevNotes => [res.data, ...prevNotes]);
      }
      
      setError(null);
      return res.data;
    } catch (err) {
      console.error('Error restoring note:', err);
      setError('Failed to restore note');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Permanently delete a note
  const deleteNotePermanently = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/notes/permanent/${id}`);
      setTrashedNotes(prevNotes => prevNotes.filter(note => note._id !== id));
      setError(null);
      return true;
    } catch (err) {
      console.error('Error deleting note permanently:', err);
      setError('Failed to delete note permanently');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Archive a note
  const archiveNote = async (id) => {
    return updateNote(id, { isArchived: true });
  };

  // Unarchive a note
  const unarchiveNote = async (id) => {
    return updateNote(id, { isArchived: false });
  };

  // Set a reminder for a note
  const setNoteReminder = async (id, reminderDate) => {
    return updateNote(id, { reminder: reminderDate });
  };

  // Load notes when token changes
  useEffect(() => {
    if (token) {
      // Load all data types in parallel
      fetchNotes();
      fetchArchivedNotes();
      fetchTrashedNotes();
      fetchReminders();
    } else {
      setNotes([]);
      setArchivedNotes([]);
      setTrashedNotes([]);
      setReminders([]);
    }
  }, [token, fetchNotes, fetchArchivedNotes, fetchTrashedNotes, fetchReminders]);

  const value = {
    notes,
    archivedNotes,
    trashedNotes,
    reminders,
    loading,
    error,
    fetchNotes,
    fetchArchivedNotes,
    fetchTrashedNotes,
    fetchReminders,
    createNote,
    updateNote,
    trashNote,
    restoreNote,
    deleteNotePermanently,
    archiveNote,
    unarchiveNote,
    setNoteReminder
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
}
