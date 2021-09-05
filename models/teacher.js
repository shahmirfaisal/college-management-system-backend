const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  fatherName: {
    type: String,
    required: true,
  },
  cnic: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  joinDate: {
    type: Date,
    default: Date.now(),
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    default: null,
  },
  address: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Teacher", teacherSchema);
