const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  fatherName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  cnic: {
    type: String,
    required: true,
  },
  admissionDate: {
    type: Date,
    default: Date.now(),
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Class",
  },
  address: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Student", studentSchema);
