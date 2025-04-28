import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { useNotes } from '../contexts/NotesContext';

const NoteForm = () => {
  const { createNote } = useNotes();
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('#ffffff');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const colors = [
    '#ffffff', // white
    '#f8d7da', // light red
    '#d4edda', // light green
    '#cce5ff', // light blue
    '#fff3cd', // light yellow
    '#e2e3e5', // light gray
    '#d1ecf1', // light teal
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() && !content.trim()) {
      setIsExpanded(false);
      return;
    }
    
    try {
      setIsSubmitting(true);
      await createNote({
        title: title.trim() || 'Untitled',
        content,
        color
      });
      
      // Reset form
      setTitle('');
      setContent('');
      setColor('#ffffff');
      setIsExpanded(false);
    } catch (error) {
      console.error('Error creating note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    setColor('#ffffff');
    setIsExpanded(false);
  };

  return (
    <div className="max-w-md mx-auto my-8">
      <AnimatePresence>
        {!isExpanded ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex justify-center"
          >
            <button
              id="add-note-button"
              onClick={() => setIsExpanded(true)}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors duration-300"
            >
              <FaPlus />
              <span>Add Note</span>
            </button>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSubmit}
            className="note-card"
            style={{ backgroundColor: color }}
          >
            <div className="flex justify-between items-center mb-2">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-green-500 font-bold"
                autoFocus
              />
              <button
                type="button"
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FaTimes />
              </button>
            </div>
            
            <textarea
              placeholder="Take a note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 min-h-[100px] bg-transparent focus:outline-none resize-none"
            />
            
            <div className="flex justify-between items-center mt-4">
              <div className="flex space-x-2">
                {colors.map((c) => (
                  <div
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-full cursor-pointer border border-gray-300 ${
                      color === c ? 'ring-2 ring-green-500' : ''
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary text-sm"
              >
                {isSubmitting ? 'Adding...' : 'Add Note'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NoteForm;
