const router = require("express").Router();
const {
  getClasses,
  getClass,
  createClass,
  updateClass,
  deleteClass,
} = require("../controllers/class");
const checkAuth = require("../middlewares/checkAuth");

// Fetching all the classes
router.get("/", getClasses);

// Fetching a specific class
router.get("/:id", getClass);

// Creating a class
router.post("/", checkAuth, createClass);

// Updating a class
router.patch("/:id", checkAuth, updateClass);

// Deleting a class
router.delete("/:id", checkAuth, deleteClass);

module.exports = router;
