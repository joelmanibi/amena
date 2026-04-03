const { body } = require('express-validator');

function jsonObjectValidator(field, label) {
  return body(field)
    .optional({ nullable: true })
    .custom((value) => {
      if (value === undefined || value === null) {
        return true;
      }

      if (typeof value !== 'object' || Array.isArray(value)) {
        throw new Error(`${label} must be a JSON object.`);
      }

      return true;
    });
}

const updateSiteContentValidator = [
  jsonObjectValidator('fr', 'French site content'),
  jsonObjectValidator('en', 'English site content'),
];

module.exports = { updateSiteContentValidator };