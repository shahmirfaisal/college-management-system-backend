const Teacher = require("../models/teacher");
const Class = require("../models/class");
const { errorHandler } = require("../utils");
const cloudinary = require("cloudinary").v2;

exports.getTeachers = async (req, res, next) => {
  try {
    const teachers = await Teacher.find().populate("class", "name").exec();
    res.json({ teachers });
  } catch (error) {
    return errorHandler(error.message, error.status, next);
  }
};

exports.getTeacher = async (req, res, next) => {
  const { id } = req.params;
  try {
    const teacher = await Teacher.findById(id).populate("class", "name").exec();
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
      gender,
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

    const teacher = await Teacher.findById(id);
    teacher.name = name;
    teacher.fatherName = fatherName;
    teacher.image = image;
    teacher.dateOfBirth = dateOfBirth;
    teacher.cnic = cnic;
    teacher.joinDate = joinDate;
    teacher.address = address;
    teacher.phone = phone;
    teacher.gender = gender;
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

exports.deleteTeacher = async (req, res, next) => {
  const { id } = req.params;
  try {
    const teacher = await Teacher.findById(id);
    if (teacher.class) {
      const oldClass = await Class.findById(teacher.class);
      oldClass.teacher = null;
      await oldClass.save();
    }
    await Teacher.deleteOne({ _id: id });
    res.json({ teacher });
  } catch (error) {
    return errorHandler(error.message, error.status, next);
  }
};
