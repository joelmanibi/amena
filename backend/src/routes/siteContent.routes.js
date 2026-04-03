const router = require('express').Router();
const controller = require('../controllers/siteContent.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { handleValidation } = require('../middleware/validate.middleware');
const { updateSiteContentValidator } = require('../validators/siteContent.validator');

router.get('/site-content', controller.getSiteContent);
router.put(
  '/site-content',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'),
  updateSiteContentValidator,
  handleValidation,
  controller.updateSiteContent
);

module.exports = router;