const router = require('express').Router();
const controller = require('../controllers/article.controller');
const { authenticate, authenticateOptional, authorize } = require('../middleware/auth.middleware');
const { handleValidation } = require('../middleware/validate.middleware');
const {
  createArticleValidator,
  updateArticleValidator,
  articleIdParamValidator,
  articleSlugParamValidator,
} = require('../validators/article.validator');

router.get('/', authenticateOptional, controller.getArticles);
router.get('/:slug', articleSlugParamValidator, handleValidation, controller.getArticleBySlug);
router.post('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), createArticleValidator, handleValidation, controller.createArticle);
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), articleIdParamValidator, updateArticleValidator, handleValidation, controller.updateArticle);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), articleIdParamValidator, handleValidation, controller.deleteArticle);

module.exports = router;
