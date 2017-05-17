var handleDuplicateKeyError = function (error, res, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next();
  }
};

module.exports = handleDuplicateKeyError;
