const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id: ..., role: ... }
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
}

// allow user to act on their own resource OR allow users with allowedRoles
function authorizeOrSelf(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (allowedRoles.includes(req.user.role)) {
      return next();
    }

    // allow if the resource id matches the authenticated user's id
    if (req.params && req.params.id && req.params.id.toString() === req.user.id.toString()) {
      return next();
    }

    return res.status(403).json({ message: 'Forbidden' });
  };
}

module.exports = {
  authenticate,
  authorize,
  authorizeOrSelf
};
