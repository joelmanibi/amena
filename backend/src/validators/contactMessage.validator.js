const { body, param } = require('express-validator');

const createContactMessageValidator = [
  body('fullName').trim().notEmpty().withMessage('Full name is required.'),
  body('email').trim().isEmail().withMessage('A valid email is required.'),
  body('subject').trim().notEmpty().withMessage('Subject is required.'),
  body('message').trim().notEmpty().withMessage('Message is required.'),
  body('phone').optional().trim(),
  body('company').optional().trim(),
];

const contactMessageIdParamValidator = [param('id').isInt({ min: 1 }).withMessage('Invalid message id.')];

const updateContactMessageValidator = [
  ...contactMessageIdParamValidator,
  body('status').optional().isIn(['new', 'read', 'replied', 'archived']).withMessage('Invalid message status.'),
  body('assignedUserId').optional({ nullable: true }).isInt({ min: 1 }).withMessage('assignedUserId must be numeric.'),
];

module.exports = {
  createContactMessageValidator,
  contactMessageIdParamValidator,
  updateContactMessageValidator,
};
