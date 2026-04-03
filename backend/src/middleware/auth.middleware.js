const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { User } = require('../models');

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'];

async function getUserFromAuthHeader(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, env.jwtSecret);
  const user = await User.findByPk(decoded.id);

  if (!user || !user.isActive) {
    return null;
  }

  return user;
}

async function authenticate(req, res, next) {
  try {
    const user = await getUserFromAuthHeader(req.headers.authorization);
    if (!user) {
      return res.status(401).json({ message: 'Authorization token is required.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

async function authenticateOptional(req, res, next) {
  try {
    const user = await getUserFromAuthHeader(req.headers.authorization);
    if (user) {
      req.user = user;
    }
  } catch (error) {
    req.user = null;
  }

  next();
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || (roles.length && !roles.includes(req.user.role))) {
      return res.status(403).json({ message: 'Forbidden.' });
    }
    next();
  };
}

module.exports = { authenticate, authenticateOptional, authorize, ADMIN_ROLES };
