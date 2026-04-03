const { body } = require('express-validator');

const updateCompanyProfileValidator = [
  body('address').optional({ nullable: true }).trim().isLength({ max: 2000 }).withMessage('Address must be 2000 characters or fewer.'),
  body('email').optional({ nullable: true }).trim().isEmail().withMessage('A valid email is required.'),
  body('phone').optional({ nullable: true }).trim().isLength({ max: 50 }).withMessage('Phone must be 50 characters or fewer.'),
  body('websiteUrl')
    .optional({ nullable: true })
    .trim()
    .isURL({ require_protocol: true })
    .withMessage('Website URL must be a valid absolute URL.'),
  body('facebookUrl')
    .optional({ nullable: true })
    .trim()
    .isURL({ require_protocol: true })
    .withMessage('Facebook URL must be a valid absolute URL.'),
  body('linkedinUrl')
    .optional({ nullable: true })
    .trim()
    .isURL({ require_protocol: true })
    .withMessage('LinkedIn URL must be a valid absolute URL.'),
  body('instagramUrl')
    .optional({ nullable: true })
    .trim()
    .isURL({ require_protocol: true })
    .withMessage('Instagram URL must be a valid absolute URL.'),
];

module.exports = { updateCompanyProfileValidator };