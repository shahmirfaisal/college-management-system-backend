const jwt = require("jsonwebtoken");
const { errorHandler } = require("../utils");

const checkAuth = (req, res, next) => {
  let token = req.get("Authorization")?.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, process.env.AUTH_SECRET);
    if (!decodedToken) return errorHandler("Unauthenticated", 401, next);
    next();
  } catch (error) {
    return errorHandler("Unauthenticated", 401, next);
  }
};

module.exports = checkAuth;
