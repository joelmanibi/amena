const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/', require('./companyProfile.routes'));
router.use('/', require('./siteContent.routes'));
router.use('/articles', require('./article.routes'));
router.use('/categories', require('./category.routes'));
router.use('/trainings', require('./training.routes'));
router.use('/', require('./teamMember.routes'));
router.use('/', require('./trainingSession.routes'));
router.use('/', require('./trainingRegistration.routes'));
router.use('/', require('./contactMessage.routes'));

module.exports = router;