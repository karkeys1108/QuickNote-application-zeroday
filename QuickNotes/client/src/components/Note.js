import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTrash, FaArchive, FaEdit, FaBell, FaUndo } from 'react-icons/fa';
import { format } from 'date-fns';
import { useNotes } from '../contexts/NotesContext';

const Note = ({ note, isInTrash = false, isArchived = false }) => {
  const { 
    updateNote, 
    trashNote, 
    restoreNote, 
    deleteNotePermanently, 
    archiveNote, 
    unarchiveNote,
    setNoteReminder
  } = useNotes();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(note.title);
  const [editedContent, setEditedContent] = useState(note.content);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [reminderDate, setReminderDate] = useState(
    note.reminder ? new Date(note.reminder).toISOString().slice(0, 16) : ''
  );

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const formatDateTime = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      console.error('Error formatting date time:', error);
      return 'Invalid date';
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedTitle(note.title);
    setEditedContent(note.content);
  };

  const handleSave = async () => {
    try {
      await updateNote(note._id, {
        title: editedTitle.trim() || 'Untitled',
        content: editedContent
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleTrash = async () => {
    try {
      await trashNote(note._id);
    } catch (error) {
      console.error('Error trashing note:', error);
    }
  };

  const handleRestore = async () => {
    try {
      await restoreNote(note._id);
    } catch (error) {
      console.error('Error restoring note:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to permanently delete this note? This action cannot be undone.')) {
      try {
        await deleteNotePermanently(note._id);
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  const handleArchive = async () => {
    try {
      await archiveNote(note._id);
    } catch (error) {
      console.error('Error archiving note:', error);
    }
  };

  const handleUnarchive = async () => {
    try {
      await unarchiveNote(note._id);
    } catch (error) {
      console.error('Error unarchiving note:', error);
    }
  };

  const handleSetReminder = async () => {
    if (!reminderDate) {
      setShowDatePicker(true);
      return;
    }
    
    try {
      await setNoteReminder(note._id, new Date(reminderDate));
      setShowDatePicker(false);
    } catch (error) {
      console.error('Error setting reminder:', error);
    }
  };

  const handleClearReminder = async () => {
    try {
      await setNoteReminder(note._id, null);
      setReminderDate('');
    } catch (error) {
      console.error('Error clearing reminder:', error);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.02 }}
      className="note-card"
      style={{ backgroundColor: note.color || '#ffffff' }}
    >
      {isEditing ? (
        // Edit mode
        <div className="flex flex-col h-full">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full p-2 mb-2 bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-green-500 font-bold"
            placeholder="Title"
          />
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full p-2 flex-grow bg-transparent focus:outline-none resize-none"
            placeholder="Take a note..."
          />
          <div className="flex justify-end space-x-2 mt-2">
            <button onClick={handleCancel} className="btn-secondary text-sm px-3 py-1">
              Cancel
            </button>
            <button onClick={handleSave} className="btn-primary text-sm px-3 py-1">
              Save
            </button>
          </div>
        </div>
      ) : (
        // View mode
        <div>
          <h3 className="font-bold text-lg mb-2 text-black dark:text-white">{note.title}</h3>
          <p className="text-black dark:text-gray-200 whitespace-pre-wrap mb-4">{note.content}</p>
          
          {note.reminder && (
            <div className="flex items-center text-xs text-gray-700 dark:text-gray-400 mb-3">
              <FaBell className="mr-1" />
              <span>
                Reminder: {formatDateTime(note.reminder)}
              </span>
              <button 
                onClick={handleClearReminder}
                className="ml-2 text-red-500 hover:text-red-600 text-xs"
                title="Clear reminder"
              >
                ×
              </button>
            </div>
          )}
          
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>
              {formatDate(note.updatedAt)}
            </span>
            
            <div className="flex space-x-2">
              {showDatePicker ? (
                <div className="flex items-center">
                  <input
                    type="datetime-local"
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                    className="text-xs p-1 rounded border border-gray-300 dark:border-gray-600 mr-1"
                  />
                  <button 
                    onClick={handleSetReminder}
                    className="text-green-500 hover:text-green-600"
                  >
                    Set
                  </button>
                </div>
              ) : (
                <>
                  {isInTrash ? (
                    <>
                      <button 
                        onClick={handleRestore} 
                        className="text-green-500 hover:text-green-600"
                        title="Restore"
                      >
                        <FaUndo />
                      </button>
                      <button 
                        onClick={handleDelete} 
                        className="text-red-500 hover:text-red-600"
                        title="Delete permanently"
                      >
                        <FaTrash />
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={handleSetReminder} 
                        className="text-blue-500 hover:text-blue-600"
                        title={note.reminder ? "Change reminder" : "Add reminder"}
                      >
                        <FaBell />
                      </button>
                      <button 
                        onClick={handleEdit} 
                        className="text-blue-500 hover:text-blue-600"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      {isArchived ? (
                        <button 
                          onClick={handleUnarchive} 
                          className="text-yellow-500 hover:text-yellow-600"
                          title="Unarchive"
                        >
                          <FaArchive />
                        </button>
                      ) : (
                        <button 
                          onClick={handleArchive} 
                          className="text-yellow-500 hover:text-yellow-600"
                          title="Archive"
                        >
                          <FaArchive />
                        </button>
                      )}
                      <button 
                        onClick={handleTrash} 
                        className="text-red-500 hover:text-red-600"
                        title="Move to trash"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Note;
