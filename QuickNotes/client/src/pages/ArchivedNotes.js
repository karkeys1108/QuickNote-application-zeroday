import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Note from '../components/Note';
import { useNotes } from '../contexts/NotesContext';
import { FaSpinner, FaArchive } from 'react-icons/fa';

const ArchivedNotes = () => {
  const { archivedNotes, loading, error, fetchArchivedNotes } = useNotes();

  useEffect(() => {
    fetchArchivedNotes();
  }, [fetchArchivedNotes]);

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
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Archived Notes</h1>
          
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <FaSpinner className="animate-spin text-green-500 text-4xl" />
            </div>
          ) : archivedNotes.length === 0 ? (
            <div className="text-center py-10">
              <FaArchive className="mx-auto text-gray-400 text-5xl mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No archived notes found</p>
            </div>
          ) : (
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {archivedNotes.map(note => (
                <Note key={note._id} note={note} isArchived={true} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArchivedNotes;
