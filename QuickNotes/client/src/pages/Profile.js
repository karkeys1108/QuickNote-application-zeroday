import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { FaUser, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const Profile = () => {
  const { currentUser } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: currentUser?.displayName || '',
    bio: currentUser?.bio || '',
    email: currentUser?.email || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // In a real app, this would update the user profile in the database
      // For our demo, we'll update the local storage and context
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
      
      // Update the user data in localStorage
      const updatedUser = {
        ...currentUser,
        displayName: formData.displayName,
        bio: formData.bio
      };
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update base64 user data for future requests
      const updatedUserDataBase64 = Buffer.from(JSON.stringify(updatedUser)).toString('base64');
      localStorage.setItem('userDataBase64', updatedUserDataBase64);
      
      // Force a page reload to update the user context
      window.location.reload();
      
      setSuccess('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setFormData({
      displayName: currentUser?.displayName || '',
      bio: currentUser?.bio || '',
      email: currentUser?.email || ''
    });
    setEditing(false);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-800">
      <div className="flex-grow p-6 ml-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">My Profile</h1>
          
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="relative">
                  {currentUser?.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt="Profile" 
                      className="rounded-full h-32 w-32 object-cover border-4 border-green-500"
                    />
                  ) : (
                    <div className="rounded-full h-32 w-32 bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                      <FaUser size={48} className="text-gray-500 dark:text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  {editing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Display Name
                        </label>
                        <input
                          type="text"
                          name="displayName"
                          value={formData.displayName}
                          onChange={handleChange}
                          className="input-field"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="input-field"
                          required
                          disabled
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Email cannot be changed
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Bio
                        </label>
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          rows={4}
                          className="input-field"
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                      
                      {error && (
                        <div className="p-3 bg-red-100 text-red-700 rounded-md">
                          {error}
                        </div>
                      )}
                      
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="btn-primary flex items-center gap-2"
                          disabled={loading}
                        >
                          <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="btn-secondary flex items-center gap-2"
                          disabled={loading}
                        >
                          <FaTimes /> Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {currentUser?.displayName || 'User'}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                          {currentUser?.email || 'No email provided'}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Bio</h3>
                        <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                          {currentUser?.bio || 'No bio provided'}
                        </p>
                      </div>
                      
                      {success && (
                        <div className="p-3 bg-green-100 text-green-700 rounded-md">
                          {success}
                        </div>
                      )}
                      
                      <button
                        onClick={() => setEditing(true)}
                        className="btn-primary flex items-center gap-2"
                      >
                        <FaEdit /> Edit Profile
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4">
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Account created
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Notes created
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {/* This would be fetched from the API in a real app */}
                    5 notes
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Last active
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Today
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                Account Settings
              </h2>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-600">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Dark Mode
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Toggle between light and dark theme
                    </p>
                  </div>
                  <div className="relative inline-block w-12 align-middle select-none cursor-pointer" onClick={toggleDarkMode}>
                    <div className={`block w-10 h-6 rounded-full ${darkMode ? 'bg-green-500' : 'bg-gray-300'} transition-colors duration-200`}>
                      <div className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-200 transform ${darkMode ? 'translate-x-4' : ''}`}></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-600">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Email Notifications
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive email notifications for reminders
                    </p>
                  </div>
                  <div className="relative inline-block w-12 align-middle select-none">
                    <div className="block w-10 h-6 rounded-full bg-gray-300 transition-colors duration-200">
                      <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-200 transform"></div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
