const router = require('express').Router();
const controller = require('../controllers/upload.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { handleValidation } = require('../middleware/validate.middleware');
const { uploadImageValidator } = require('../validators/upload.validator');

router.post(
  '/uploads/images',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'),
  uploadImageValidator,
  handleValidation,
  controller.uploadImage
);

module.exports = router;