const router = require('express').Router();
const controller = require('../controllers/companyProfile.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { handleValidation } = require('../middleware/validate.middleware');
const { updateCompanyProfileValidator } = require('../validators/companyProfile.validator');

router.get('/company-profile', controller.getCompanyProfile);
router.put(
  '/company-profile',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'),
  updateCompanyProfileValidator,
  handleValidation,
  controller.updateCompanyProfile
);

module.exports = router;