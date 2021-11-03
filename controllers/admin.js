const jwt = require("jsonwebtoken");
const { errorHandler } = require("../utils");

exports.login = (req, res, next) => {
  let { email, password } = req.body;
  email = email.trim();

  // Validation
  if (email !== process.env.ADMIN_EMAIl) {
    return errorHandler("Wrong email!", 422, next);
  }
  if (password !== process.env.ADMIN_PASSWORD) {
    return errorHandler("Wrong password!", 422, next);
  }

  // Login the admin
  const token = jwt.sign({ admin: "admin" }, process.env.AUTH_SECRET, {
    expiresIn: "7d",
  });
  res.json({ token });
};

exports.isLogin = (req, res, next) => {
  res.json({ message: "Logged in!" });
};
