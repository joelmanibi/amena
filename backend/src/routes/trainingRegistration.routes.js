const router = require('express').Router();
const controller = require('../controllers/trainingRegistration.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { handleValidation } = require('../middleware/validate.middleware');
const {
  createRegistrationValidator,
  registrationIdParamValidator,
  updateRegistrationStatusValidator,
} = require('../validators/trainingRegistration.validator');

router.get('/registrations', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), controller.getRegistrations);
router.get('/registrations/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), registrationIdParamValidator, handleValidation, controller.getRegistrationById);
router.post('/registrations', createRegistrationValidator, handleValidation, controller.createRegistration);
router.patch('/registrations/:id/status', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), updateRegistrationStatusValidator, handleValidation, controller.updateRegistrationStatus);

module.exports = router;
