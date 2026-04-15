const { body, param } = require('express-validator');

const createRegistrationValidator = [
  body('sessionId').optional().isInt({ min: 1 }).withMessage('sessionId must be a valid integer.'),
  body('programId').optional().isInt({ min: 1 }).withMessage('programId must be a valid integer.'),
  body('fullName').trim().notEmpty().withMessage('Full name is required.'),
  body('email').trim().isEmail().withMessage('A valid email is required.'),
  body('phone').optional().trim(),
  body('company').optional().trim(),
  body('jobTitle').optional().trim(),
  body('message').optional().trim(),
  body().custom((value) => {
    if (!value?.sessionId && !value?.programId) {
      throw new Error('sessionId or programId is required.');
    }

    return true;
  }),
];

const registrationIdParamValidator = [param('id').isInt({ min: 1 }).withMessage('Invalid registration id.')];

const updateRegistrationStatusValidator = [
  ...registrationIdParamValidator,
  body('status').isIn(['pending', 'confirmed', 'cancelled']).withMessage('Invalid registration status.'),
];

module.exports = {
  createRegistrationValidator,
  registrationIdParamValidator,
  updateRegistrationStatusValidator,
};
