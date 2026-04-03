const router = require('express').Router();
const controller = require('../controllers/training.controller');
const { authenticate, authenticateOptional, authorize } = require('../middleware/auth.middleware');
const { handleValidation } = require('../middleware/validate.middleware');
const {
  createTrainingValidator,
  updateTrainingValidator,
  trainingIdParamValidator,
  trainingSlugParamValidator,
} = require('../validators/training.validator');

router.get('/', authenticateOptional, controller.getTrainings);
router.get('/slug/:slug', authenticateOptional, trainingSlugParamValidator, handleValidation, controller.getTrainingBySlug);
router.get('/:id', authenticateOptional, trainingIdParamValidator, handleValidation, controller.getTrainingById);
router.post('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), createTrainingValidator, handleValidation, controller.createTraining);
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), trainingIdParamValidator, updateTrainingValidator, handleValidation, controller.updateTraining);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), trainingIdParamValidator, handleValidation, controller.deleteTraining);

module.exports = router;
