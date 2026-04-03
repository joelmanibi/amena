const router = require('express').Router();
const { login } = require('../controllers/auth.controller');
const { handleValidation } = require('../middleware/validate.middleware');
const { loginValidator } = require('../validators/auth.validator');

router.post('/login', loginValidator, handleValidation, login);

module.exports = router;
