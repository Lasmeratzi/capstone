const jwt = require('jsonwebtoken');

const authenticateAny = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    // Try to verify as user token first
    const userDecoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (userDecoded.role === 'admin' || userDecoded.role === 'super_admin') {
      // It's an admin token
      req.user = userDecoded;
      req.isAdmin = true;
    } else {
      // It's a regular user token
      req.user = userDecoded;
      req.isAdmin = false;
    }
    
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = authenticateAny;