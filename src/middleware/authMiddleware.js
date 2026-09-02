const jwt = require('jsonwebtoken');

// This middleware protects routes by verifying JWT.
const protect = (req, res, next) => {
  try {
    let token = null;

    // 1) Try to read token from Authorization header.
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 2) If header token is missing, try cookie token.
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // If token is still missing, block access.
    if (!token) {
      return res.status(401).json({ message: 'Not authorized. Token missing.' });
    }

    // Verify token signature and expiration.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Save decoded user data in request for next middleware/controller.
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized. Invalid token.' });
  }
};

module.exports = protect;
