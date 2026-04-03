const router = require('express').Router();
const controller = require('../controllers/contactMessage.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { handleValidation } = require('../middleware/validate.middleware');
const {
  createContactMessageValidator,
  contactMessageIdParamValidator,
  updateContactMessageValidator,
} = require('../validators/contactMessage.validator');

router.get('/contact-messages', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), controller.getContactMessages);
router.get('/contact-messages/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), contactMessageIdParamValidator, handleValidation, controller.getContactMessageById);
router.post('/contact-messages', createContactMessageValidator, handleValidation, controller.createContactMessage);
router.patch('/contact-messages/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), updateContactMessageValidator, handleValidation, controller.updateContactMessage);
router.delete('/contact-messages/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), contactMessageIdParamValidator, handleValidation, controller.deleteContactMessage);

module.exports = router;
