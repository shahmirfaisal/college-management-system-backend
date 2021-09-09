const router = require("express").Router();
const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/student");
const checkAuth = require("../middlewares/checkAuth");

// Fetching all the students
router.get("/", getStudents);

// Fetching a specific student
router.get("/:id", getStudent);

// Creating a student
router.post("/", checkAuth, createStudent);

// Updating a student
router.patch("/:id", checkAuth, updateStudent);

// Deleting a student
router.delete("/:id", checkAuth, deleteStudent);

module.exports = router;
