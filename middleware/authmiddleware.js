const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticate(req, res, next) {
  const token =
    req.cookies?.token ||
    req.headers['authorization']?.split(' ')[1] ||
    req.session?.token;

  if (!token) return res.status(401).json({ error: 'Unauthorized. Please login.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

function authorizeAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }
  next();
}

module.exports = { authenticate, authorizeAdmin };