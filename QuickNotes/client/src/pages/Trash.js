import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Note from '../components/Note';
import { useNotes } from '../contexts/NotesContext';
import { FaSpinner, FaTrash } from 'react-icons/fa';

const Trash = () => {
  const { trashedNotes, loading, error, fetchTrashedNotes, deleteNotePermanently } = useNotes();

  useEffect(() => {
    fetchTrashedNotes();
  }, [fetchTrashedNotes]);

  const handleEmptyTrash = async () => {
    if (trashedNotes.length === 0) return;
    
    if (window.confirm('Are you sure you want to permanently delete all notes in trash? This action cannot be undone.')) {
      try {
        // Delete all trashed notes
        for (const note of trashedNotes) {
          await deleteNotePermanently(note._id);
        }
      } catch (error) {
        console.error('Error emptying trash:', error);
      }
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 p-4 ml-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Trash</h1>
            
            {trashedNotes.length > 0 && (
              <button 
                onClick={handleEmptyTrash}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300"
              >
                Empty Trash
              </button>
            )}
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <FaSpinner className="animate-spin text-green-500 text-4xl" />
            </div>
          ) : trashedNotes.length === 0 ? (
            <div className="text-center py-10">
              <FaTrash className="mx-auto text-gray-400 text-5xl mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Trash is empty</p>
            </div>
          ) : (
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {trashedNotes.map(note => (
                <Note key={note._id} note={note} isInTrash={true} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trash;
