const router = require('express').Router();
const controller = require('../controllers/trainingSession.controller');
const { authenticate, authenticateOptional, authorize } = require('../middleware/auth.middleware');
const { handleValidation } = require('../middleware/validate.middleware');
const {
  createSessionValidator,
  updateSessionValidator,
  sessionIdParamValidator,
  trainingIdParamValidator,
} = require('../validators/trainingSession.validator');

router.get('/trainings/:trainingId/sessions', authenticateOptional, trainingIdParamValidator, handleValidation, controller.getTrainingSessions);
router.post('/trainings/:trainingId/sessions', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), createSessionValidator, handleValidation, controller.createTrainingSession);
router.put('/training-sessions/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), updateSessionValidator, handleValidation, controller.updateTrainingSession);
router.delete('/training-sessions/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), sessionIdParamValidator, handleValidation, controller.deleteTrainingSession);

module.exports = router;
