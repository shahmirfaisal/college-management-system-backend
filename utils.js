exports.errorHandler = (message, status, next) => {
  const error = new Error(message);
  error.status = status || 500;
  return next(error);
};
