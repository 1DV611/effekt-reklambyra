var handleDuplicateKeyError = function (error, res, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(console.error(error));
  } else {
    next();
  }
};

module.exports = handleDuplicateKeyError;
