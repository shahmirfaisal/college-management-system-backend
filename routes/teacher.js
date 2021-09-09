const router = require("express").Router();
const {
  getTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
} = require("../controllers/teacher");
const checkAuth = require("../middlewares/checkAuth");

// Fetching all the teachers
router.get("/", getTeachers);

// Fetching a specific teacher
router.get("/:id", getTeacher);

// Creating a teacher
router.post("/", checkAuth, createTeacher);

// Updating a teacher
router.patch("/:id", checkAuth, updateTeacher);

module.exports = router;
