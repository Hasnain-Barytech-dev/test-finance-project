const validator = require('validator');

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return validator.escape(input);
};

const validateEmail = (email) => {
  return validator.isEmail(email);
};

const validateUUID = (id) => {
  return validator.isUUID(id);
};

const sanitizeObject = (obj) => {
  const sanitized = {};
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      sanitized[key] = sanitizeInput(obj[key]);
    } else {
      sanitized[key] = obj[key];
    }
  }
  return sanitized;
};

module.exports = {
  sanitizeInput,
  validateEmail,
  validateUUID,
  sanitizeObject
};