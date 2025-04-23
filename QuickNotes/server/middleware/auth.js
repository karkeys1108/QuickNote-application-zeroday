const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // For demo mode, allow access even without a token
  // In a real app, this would be more strict
  if (!token) {
    // For demo purposes, create a mock user
    req.user = { id: '123456789' };
    console.log('Demo mode: Allowing access without token');
    return next();
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    
    // For demo purposes, still allow access with a mock user
    req.user = { id: '123456789' };
    console.log('Demo mode: Allowing access despite invalid token');
    next();
  }
};
