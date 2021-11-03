const Student = require("../models/student");
const Teacher = require("../models/teacher");
const Class = require("../models/class");
const { errorHandler } = require("../utils");
const cloudinary = require("cloudinary").v2;

exports.getStudents = async (req, res, next) => {
  try {
    const students = await Student.find().populate("class", "name").exec();
    res.json({ students });
  } catch (error) {
    return errorHandler(error.message, error.status, next);
  }
};

exports.getStudent = async (req, res, next) => {
  const { id } = req.params;

  try {
    const student = await Student.findById(id).populate("class", "name").exec();
    const teacher = await Teacher.findOne({ class: student.class._id });
    res.json({
      student,
    });
  } catch (error) {
    return errorHandler(error.message, error.status, next);
  }
};

exports.createStudent = async (req, res, next) => {
  let {
    name,
    fatherName,
    image,
    dateOfBirth,
    cnic,
    admissionDate,
    class: stdClass,
    address,
    phone,
    gender,
  } = req.body;
  name = name?.trim();
  fatherName = fatherName?.trim();
  image = image?.trim();
  address = address?.trim();
  gender = gender?.trim();

  if (phone.length !== 11) {
    return errorHandler("Invalid phone number!", 422, next);
  }
  if (cnic.length !== 13) {
    return errorHandler("Invalid cnic!", 422, next);
  }
  if (!image?.length) {
    return errorHandler("Please upload the image!", 422, next);
  }

  try {
    const highStudents = await Student.find().sort({ rollNumber: -1 }).limit(1);
    if (highStudents.length) {
      var rollNumber = highStudents[0].rollNumber + 1;
    } else {
      var rollNumber = parseInt(
        new String(new Date().getFullYear()).slice(2) + 1
      );
    }

    const result = await cloudinary.uploader.upload(image);
    image = result.url;

    const student = new Student({
      rollNumber,
      name,
      fatherName,
      image,
      dateOfBirth,
      cnic,
      admissionDate,
      class: stdClass,
      address,
      phone,
      gender,
    });
    await student.save();
    const newClass = await Class.findById(stdClass);
    newClass.students.push(student._id);
    await newClass.save();
    res.json({ student });
  } catch (error) {
    return errorHandler(
      Object.values(error?.errors)[0]?.properties?.message || error.message,
      error.status,
      next
    );
  }
};

exports.updateStudent = async (req, res, next) => {
  const { id } = req.params;
  let {
    name,
    fatherName,
    image,
    dateOfBirth,
    cnic,
    admissionDate,
    class: stdClass,
    address,
    phone,
    gender,
  } = req.body;
  name = name?.trim();
  fatherName = fatherName?.trim();
  image = image?.trim();
  address = address?.trim();
  gender = gender?.trim();

  if (phone.length !== 11) {
    return errorHandler("Invalid phone number!", 422, next);
  }
  if (cnic.length !== 13) {
    return errorHandler("Invalid cnic!", 422, next);
  }
  if (!image?.length) {
    return errorHandler("Please upload the image!", 422, next);
  }

  try {
    const result = await cloudinary.uploader.upload(image);
    image = result.url;

    const student = await Student.findById(id);
    student.name = name;
    student.fatherName = fatherName;
    student.image = image;
    student.dateOfBirth = dateOfBirth;
    student.cnic = cnic;
    student.admissionDate = admissionDate;
    student.address = address;
    student.phone = phone;
    student.gender = gender;
    await student.save();
    if (student.class != stdClass) {
      const oldClass = await Class.findById(student.class);
      oldClass.students = oldClass.students.filter((stdId) => stdId != id);
      await oldClass.save();
      student.class = stdClass;
      const newClass = await Class.findById(stdClass);
      newClass.students.push(id);
      await newClass.save();
    }
    await student.save();
    res.json({ student });
  } catch (error) {
    return errorHandler(
      Object.values(error?.errors)[0]?.properties?.message || error.message,
      error.status,
      next
    );
  }
};

exports.deleteStudent = async (req, res, next) => {
  const { id } = req.params;
  try {
    const student = await Student.findById(id);
    const oldClass = await Class.findById(student.class);
    oldClass.students = oldClass.students.filter((stdId) => stdId != id);
    await oldClass.save();
    await Student.deleteOne({ _id: id });
    res.json({ student });
  } catch (error) {
    return errorHandler(error.message, error.status, next);
  }
};
