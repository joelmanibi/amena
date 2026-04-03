const { body, param } = require('express-validator');

const createSessionValidator = [
  param('trainingId').isInt({ min: 1 }).withMessage('Invalid training id.'),
  body('sessionTitle').trim().notEmpty().withMessage('Session title is required.'),
  body('startDate').isISO8601().withMessage('startDate must be a valid ISO date.'),
  body('endDate').isISO8601().withMessage('endDate must be a valid ISO date.'),
  body('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be at least 1.'),
  body('status').optional().isIn(['open', 'closed', 'completed', 'cancelled']).withMessage('Invalid session status.'),
  body('registrationDeadline').optional().isISO8601().withMessage('registrationDeadline must be a valid ISO date.'),
];

const sessionIdParamValidator = [param('id').isInt({ min: 1 }).withMessage('Invalid session id.')];
const trainingIdParamValidator = [param('trainingId').isInt({ min: 1 }).withMessage('Invalid training id.')];

const updateSessionValidator = [
  ...sessionIdParamValidator,
  body('sessionTitle').optional().trim().notEmpty().withMessage('Session title cannot be empty.'),
  body('startDate').optional().isISO8601().withMessage('startDate must be a valid ISO date.'),
  body('endDate').optional().isISO8601().withMessage('endDate must be a valid ISO date.'),
  body('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be at least 1.'),
  body('status').optional().isIn(['open', 'closed', 'completed', 'cancelled']).withMessage('Invalid session status.'),
  body('registrationDeadline').optional().isISO8601().withMessage('registrationDeadline must be a valid ISO date.'),
];

module.exports = {
  createSessionValidator,
  updateSessionValidator,
  sessionIdParamValidator,
  trainingIdParamValidator,
};
