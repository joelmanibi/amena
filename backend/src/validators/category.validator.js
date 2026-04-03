const { body, param } = require('express-validator');

const createCategoryValidator = [
  body('name').trim().notEmpty().withMessage('Category name is required.'),
  body('slug').optional().trim().isLength({ min: 2 }).withMessage('Slug must be at least 2 characters.'),
  body('sortOrder').optional().isInt({ min: 0 }).withMessage('sortOrder must be 0 or greater.'),
  body('isActive').optional().isBoolean().withMessage('isActive must be boolean.'),
];

const updateCategoryValidator = [
  body('name').optional({ nullable: true }).trim().notEmpty().withMessage('Category name is required.'),
  body('slug').optional().trim().isLength({ min: 2 }).withMessage('Slug must be at least 2 characters.'),
  body('sortOrder').optional().isInt({ min: 0 }).withMessage('sortOrder must be 0 or greater.'),
  body('isActive').optional().isBoolean().withMessage('isActive must be boolean.'),
];

const categoryIdParamValidator = [param('id').isInt({ min: 1 }).withMessage('Invalid category id.')];

module.exports = { createCategoryValidator, updateCategoryValidator, categoryIdParamValidator };
