const { body, param } = require('express-validator');

const articleStatuses = ['draft', 'published', 'archived'];

const createArticleValidator = [
  body('title').trim().notEmpty().withMessage('Title is required.'),
  body('content').trim().notEmpty().withMessage('Content is required.'),
  body('slug').optional().trim().isLength({ min: 3 }).withMessage('Slug must be at least 3 characters.'),
  body('status').optional().isIn(articleStatuses).withMessage('Invalid article status.'),
  body('categoryIds').optional().isArray().withMessage('categoryIds must be an array.'),
  body('categoryIds.*').optional().isInt({ min: 1 }).withMessage('Each category id must be numeric.'),
  body('publishedAt').optional().isISO8601().withMessage('publishedAt must be a valid date.'),
];

const updateArticleValidator = [
  body('title').optional({ nullable: true }).trim().notEmpty().withMessage('Title is required.'),
  body('content').optional({ nullable: true }).trim().notEmpty().withMessage('Content is required.'),
  body('slug').optional().trim().isLength({ min: 3 }).withMessage('Slug must be at least 3 characters.'),
  body('status').optional().isIn(articleStatuses).withMessage('Invalid article status.'),
  body('categoryIds').optional().isArray().withMessage('categoryIds must be an array.'),
  body('categoryIds.*').optional().isInt({ min: 1 }).withMessage('Each category id must be numeric.'),
  body('publishedAt').optional().isISO8601().withMessage('publishedAt must be a valid date.'),
];

const articleIdParamValidator = [param('id').isInt({ min: 1 }).withMessage('Invalid article id.')];
const articleSlugParamValidator = [param('slug').trim().notEmpty().withMessage('Slug is required.')];

module.exports = {
  createArticleValidator,
  updateArticleValidator,
  articleIdParamValidator,
  articleSlugParamValidator,
};
