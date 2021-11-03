const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  rollNumber: {
    type: Number,
  },
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
    type: String,
    required: [true, "Please provide the cnic!"],
  },
  admissionDate: {
    type: Date,
    default: Date.now(),
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Please provide the class!"],
    ref: "Class",
  },
  address: {
    type: String,
    required: [true, "Please enter the address!"],
  },
  phone: {
    type: String,
    required: [true, "Please provide the phone number!"],
  },
  gender: {
    type: String,
    enum: {
      values: ["MALE", "FEMALE"],
      message: "{VALUE} is not supported!",
    },
    required: [true, "Please provide the gender!"],
  },
});

module.exports = mongoose.model("Student", studentSchema);
