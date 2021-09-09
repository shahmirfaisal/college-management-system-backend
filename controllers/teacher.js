const Teacher = require("../models/teacher");
const Class = require("../models/class");
const { errorHandler } = require("../utils");

exports.getTeachers = async (req, res, next) => {
  try {
    const teachers = await Teacher.find();
    res.json({ teachers });
  } catch (error) {
    return errorHandler(error.message, error.status, next);
  }
};

exports.getTeacher = async (req, res, next) => {
  const { id } = req.params;
  try {
    const teacher = await Teacher.findById(id);
    res.json({ teacher });
  } catch (error) {
    return errorHandler(error.message, error.status, next);
  }
};

exports.createTeacher = async (req, res, next) => {
  let {
    name,
    fatherName,
    image,
    dateOfBirth,
    cnic,
    joinDate,
    class: teacherClass,
    address,
    phone,
  } = req.body;
  name = name?.trim();
  fatherName = fatherName?.trim();
  image = image?.trim();
  address = address?.trim();

  try {
    const teacher = new Teacher({
      name,
      fatherName,
      image,
      dateOfBirth,
      cnic,
      joinDate,
      class: teacherClass,
      address,
      phone,
    });
    await teacher.save();
    if (teacherClass) {
      const newClass = await Class.findById(teacherClass);
      if (newClass.teacher) {
        const oldTeacher = await Teacher.findById(newClass.teacher);
        oldTeacher.class = null;
        await oldTeacher.save();
      }
      newClass.teacher = teacher._id;
      await newClass.save();
    }

    res.json({ teacher });
  } catch (error) {
    return errorHandler(
      Object.values(error?.errors)[0]?.properties?.message || error.message,
      error.status,
      next
    );
  }
};

exports.updateTeacher = async (req, res, next) => {
  const { id } = req.params;
  let {
    name,
    fatherName,
    image,
    dateOfBirth,
    cnic,
    joinDate,
    class: teacherClass,
    address,
    phone,
  } = req.body;
  name = name?.trim();
  fatherName = fatherName?.trim();
  image = image?.trim();
  address = address?.trim();

  try {
    const teacher = await Teacher.findById(id);
    teacher.name = name;
    teacher.fatherName = fatherName;
    teacher.image = image;
    teacher.dateOfBirth = dateOfBirth;
    teacher.cnic = cnic;
    teacher.joinDate = joinDate;
    teacher.address = address;
    teacher.phone = phone;
    await teacher.save();
    if (teacher.class != teacherClass) {
      if (teacher.class) {
        const oldClass = await Class.findById(teacher.class);
        oldClass.teacher = null;
        await oldClass.save();
      }
      if (teacherClass) {
        const newClass = await Class.findById(teacherClass);
        if (newClass.teacher) {
          const oldTeacher = await Teacher.findById(newClass.teacher);
          oldTeacher.class = null;
          await oldTeacher.save();
        }
        newClass.teacher = id;
        await newClass.save();
      }
      teacher.class = teacherClass;
    }
    await teacher.save();
    res.json({ teacher });
  } catch (error) {
    return errorHandler(
      Object.values(error?.errors)[0]?.properties?.message || error.message,
      error.status,
      next
    );
  }
};
