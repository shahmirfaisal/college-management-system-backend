const Student = require("../models/student");
const Class = require("../models/class");
const { errorHandler } = require("../utils");

exports.getStudents = async (req, res, next) => {
  try {
    const students = await Student.find();
    res.json({ students });
  } catch (error) {
    return errorHandler(error.message, error.status, next);
  }
};

exports.getStudent = async (req, res, next) => {
  const { id } = req.params;

  try {
    const student = await Student.findById(id);
    res.json({ student });
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
  } = req.body;
  name = name?.trim();
  fatherName = fatherName?.trim();
  image = image?.trim();
  address = address?.trim();

  try {
    const student = new Student({
      name,
      fatherName,
      image,
      dateOfBirth,
      cnic,
      admissionDate,
      class: stdClass,
      address,
      phone,
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
  } = req.body;
  name = name?.trim();
  fatherName = fatherName?.trim();
  image = image?.trim();
  address = address?.trim();

  try {
    const student = await Student.findById(id);
    student.name = name;
    student.fatherName = fatherName;
    student.image = image;
    student.dateOfBirth = dateOfBirth;
    student.cnic = cnic;
    student.admissionDate = admissionDate;
    student.address = address;
    student.phone = phone;
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
