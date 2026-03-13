const { validationResult } = require('express-validator');
const { AppError } = require('./errorHandler');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const messages = errors.array().map(err => err.msg).join(', ');
    return next(new AppError(messages, 400));
  }
  
  next();
};

module.exports = validateRequest;
