const { body } = require('express-validator');

const loginValidator = [
  body('email').trim().isEmail().withMessage('A valid email is required.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
];

module.exports = { loginValidator };
