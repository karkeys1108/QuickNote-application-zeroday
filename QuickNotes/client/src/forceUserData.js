// This script forces the correct user data to be used
// It will be imported in index.js and run before the app starts

export function setupUserData() {
  // Check if we have a token but user data is wrong
  const token = localStorage.getItem('token');
  if (token) {
    // Get the email from localStorage or use a default
    const email = localStorage.getItem('userEmail') || prompt('Please enter your email to continue:');
    
    if (email) {
      // Store the email
      localStorage.setItem('userEmail', email);
      
      // Generate username and display name from email
      const username = email.split('@')[0];
      const displayName = username.charAt(0).toUpperCase() + username.slice(1);
      
      // Generate profile photo URL
      const photoURL = `https://ui-avatars.com/api/?name=${displayName}&background=0D8ABC&color=fff`;
      
      // Create user data
      const userData = {
        id: '123456789',
        _id: '123456789',
        username: username,
        email: email,
        displayName: displayName,
        photoURL: photoURL,
        bio: "I'm using QuickNotes to organize my thoughts and tasks.",
        createdAt: new Date()
      };
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Also store user data in base64 for the server to use
      // Using browser-compatible btoa instead of Node.js Buffer
      const userDataBase64 = btoa(JSON.stringify(userData));
      localStorage.setItem('userDataBase64', userDataBase64);
      
      console.log('User data has been set up correctly:', userData);
      return userData;
    }
  }
  return null;
}
