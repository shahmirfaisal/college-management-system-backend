const router = require("express").Router();
const { login, isLogin } = require("../controllers/admin");
const checkAuth = require("../middlewares/checkAuth");

router.post("/login", login);

router.get("/is-login", checkAuth, isLogin);

module.exports = router;
