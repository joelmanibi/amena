const { body, param } = require('express-validator');

const createTeamMemberValidator = [
  body('firstName').trim().notEmpty().withMessage('First name is required.'),
  body('lastName').trim().notEmpty().withMessage('Last name is required.'),
  body('photoUrl').trim().notEmpty().withMessage('Photo URL is required.'),
  body('jobTitle').trim().notEmpty().withMessage('Job title is required.'),
  body('shortDescription').trim().notEmpty().withMessage('Short description is required.'),
  body('sortOrder').optional().isInt({ min: 0 }).withMessage('sortOrder must be a positive integer.'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean.'),
];

const updateTeamMemberValidator = [
  body('firstName').optional({ nullable: true }).trim().notEmpty().withMessage('First name is required.'),
  body('lastName').optional({ nullable: true }).trim().notEmpty().withMessage('Last name is required.'),
  body('photoUrl').optional({ nullable: true }).trim().notEmpty().withMessage('Photo URL is required.'),
  body('jobTitle').optional({ nullable: true }).trim().notEmpty().withMessage('Job title is required.'),
  body('shortDescription').optional({ nullable: true }).trim().notEmpty().withMessage('Short description is required.'),
  body('sortOrder').optional().isInt({ min: 0 }).withMessage('sortOrder must be a positive integer.'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean.'),
];

const teamMemberIdParamValidator = [param('id').isInt({ min: 1 }).withMessage('Invalid team member id.')];

module.exports = {
  createTeamMemberValidator,
  updateTeamMemberValidator,
  teamMemberIdParamValidator,
};