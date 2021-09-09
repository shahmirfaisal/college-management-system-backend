const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the name!"],
  },
  fatherName: {
    type: String,
    required: [true, "Please enter the father name!"],
  },
  image: {
    type: String,
    required: [true, "Please upload image!"],
  },
  dateOfBirth: {
    type: Date,
    required: [true, "Please provide date of birth!"],
  },
  cnic: {
    type: Number,
    min: [1000000000000, "Enter a valid cnic"],
    max: [9999999999999, "Enter a valid cnic"],
    required: [true, "Please provide the cnic!"],
  },
  joinDate: {
    type: Date,
    default: Date.now(),
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
  },
  address: {
    type: String,
    required: [true, "Please enter the address!"],
  },
  phone: {
    type: Number,
    min: [10000000000, "Enter a valid phone number!"],
    max: [99999999999, "Enter a valid phone number!"],
    required: [true, "Please provide the phone number!"],
  },
});

module.exports = mongoose.model("Teacher", teacherSchema);
