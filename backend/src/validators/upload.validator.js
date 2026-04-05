const { body } = require('express-validator');

const uploadImageValidator = [
  body('scope').isIn(['articles', 'team']).withMessage('Invalid upload scope.'),
  body('mimeType').isIn(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']).withMessage('Unsupported image format.'),
  body('contentBase64').trim().notEmpty().withMessage('Image content is required.'),
];

module.exports = {
  uploadImageValidator,
};