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
    type: String,
    required: [true, "Please provide the cnic!"],
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

module.exports = mongoose.model("Teacher", teacherSchema);
