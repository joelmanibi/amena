const { body, param } = require('express-validator');

const createTrainingValidator = [
  body('title').trim().notEmpty().withMessage('Title is required.'),
  body('description').trim().notEmpty().withMessage('Description is required.'),
  body('deliveryMode').optional().isIn(['online', 'onsite', 'hybrid']).withMessage('Invalid delivery mode.'),
  body('status').optional().isIn(['draft', 'published', 'archived']).withMessage('Invalid training status.'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be positive.'),
  body('currency').optional().isLength({ min: 3, max: 3 }).withMessage('Currency must be 3 letters.'),
];

const updateTrainingValidator = [
  body('title').optional({ nullable: true }).trim().notEmpty().withMessage('Title is required.'),
  body('description').optional({ nullable: true }).trim().notEmpty().withMessage('Description is required.'),
  body('deliveryMode').optional().isIn(['online', 'onsite', 'hybrid']).withMessage('Invalid delivery mode.'),
  body('status').optional().isIn(['draft', 'published', 'archived']).withMessage('Invalid training status.'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be positive.'),
  body('currency').optional().isLength({ min: 3, max: 3 }).withMessage('Currency must be 3 letters.'),
];

const trainingIdParamValidator = [param('id').isInt({ min: 1 }).withMessage('Invalid training id.')];

const trainingSlugParamValidator = [param('slug').trim().notEmpty().withMessage('Invalid training slug.')];

module.exports = { createTrainingValidator, updateTrainingValidator, trainingIdParamValidator, trainingSlugParamValidator };
