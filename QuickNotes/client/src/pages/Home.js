import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import NoteForm from '../components/NoteForm';
import Note from '../components/Note';
import { useNotes } from '../contexts/NotesContext';
import { useAuth } from '../contexts/AuthContext';
import { FaPlus, FaSyncAlt } from 'react-icons/fa';

const Home = () => {
  const { notes, loading, error, fetchNotes } = useNotes();
  const { currentUser } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNotes();
    setTimeout(() => setRefreshing(false), 600);
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
      
      <div className="flex-1 p-4 ml-16 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Quick Note - Elite Vanguards</h1>
            <button 
              onClick={handleRefresh} 
              className="flex items-center px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              disabled={refreshing}
            >
              <FaSyncAlt className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          
          <NoteForm />
          
          {notes.length === 0 ? (
            <div className="text-center py-10">
              <div className="flex flex-col items-center justify-center">
                <FaPlus className="text-gray-400 text-5xl mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {currentUser ? 
                    "You don't have any notes yet. Create your first note!" : 
                    "Please log in to view your notes."}
                </p>
                {currentUser && (
                  <button 
                    onClick={() => document.getElementById('add-note-button')?.click()}
                    className="btn-primary flex items-center"
                  >
                    <FaPlus className="mr-2" /> Add Note
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4 text-gray-600 dark:text-gray-300">
                Showing {notes.length} note{notes.length !== 1 ? 's' : ''}
              </div>
              <AnimatePresence>
                <motion.div 
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {notes.map(note => (
                    <Note key={note._id} note={note} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
