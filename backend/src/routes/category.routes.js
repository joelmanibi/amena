const router = require('express').Router();
const controller = require('../controllers/category.controller');
const { authenticate, authenticateOptional, authorize } = require('../middleware/auth.middleware');
const { handleValidation } = require('../middleware/validate.middleware');
const {
  createCategoryValidator,
  updateCategoryValidator,
  categoryIdParamValidator,
} = require('../validators/category.validator');

router.get('/', authenticateOptional, controller.getCategories);
router.get('/:id', categoryIdParamValidator, handleValidation, controller.getCategoryById);
router.post('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), createCategoryValidator, handleValidation, controller.createCategory);
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), categoryIdParamValidator, updateCategoryValidator, handleValidation, controller.updateCategory);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), categoryIdParamValidator, handleValidation, controller.deleteCategory);

module.exports = router;
