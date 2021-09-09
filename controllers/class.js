const Class = require("../models/class");
const Teacher = require("../models/teacher");
const { errorHandler } = require("../utils");

exports.getClasses = async (req, res, next) => {
  try {
    const classes = await Class.find();
    res.json({ classes });
  } catch (error) {
    return errorHandler(error.message, error.status, next);
  }
};

exports.getClass = async (req, res, next) => {
  const { id } = req.params;
  try {
    const newClass = await Class.findById(id);
    res.json({ class: newClass });
  } catch (error) {
    return errorHandler(error.message, error.status, next);
  }
};

exports.createClass = async (req, res, next) => {
  let { name, teacher } = req.body;
  name = name.trim();
  try {
    const newClass = new Class({
      name,
      teacher,
    });
    await newClass.save();
    if (teacher) {
      const newTeacher = await Teacher.findById(teacher);
      if (newTeacher.class) {
        const oldClass = await Class.findById(newTeacher.class);
        oldClass.teacher = null;
        await oldClass.save();
      }
      newTeacher.class = newClass._id;
      await newTeacher.save();
    }
    await newClass.save();
    res.json({ class: newClass });
  } catch (error) {
    return errorHandler(
      Object.values(error?.errors)[0]?.properties?.message || error.message,
      error.status,
      next
    );
  }
};

exports.updateClass = async (req, res, next) => {
  const { id } = req.params;
  let { name, teacher } = req.body;
  name = name.trim();
  try {
    const newClass = await Class.findById(id);
    newClass.name = name;
    await newClass.save();
    if (teacher != newClass.teacher) {
      if (newClass.teacher) {
        const oldTeacher = await Teacher.findById(newClass.teacher);
        oldTeacher.class = null;
        await oldTeacher.save();
      }
      if (teacher) {
        const newTeacher = await Teacher.findById(teacher);
        const oldClass = await Class.findById(newTeacher.class);
        oldClass.teacher = null;
        await oldClass.save();
        newTeacher.class = id;
        await newTeacher.save();
      }
      newClass.teacher = teacher;
    }
    await newClass.save();
    res.json({ class: newClass });
  } catch (error) {
    console.log(error);
    return errorHandler(
      Object.values(error?.errors)[0]?.properties?.message || error.message,
      error.status,
      next
    );
  }
};

exports.deleteClass = async (req, res, next) => {
  const { id } = req.params;
  try {
    const newClass = await Class.findById(id);
    if (newClass.students.length)
      return errorHandler(
        "Can't delete the class because it contains students!",
        422,
        next
      );
    if (newClass.teacher) {
      const teacher = await Teacher.findById(newClass.teacher);
      teacher.class = null;
      await teacher.save();
    }
    await Class.deleteOne({ _id: id });
    res.json({ class: newClass });
  } catch (error) {
    return errorHandler(
      Object.values(error?.errors)[0]?.properties?.message || error.message,
      error.status,
      next
    );
  }
};
