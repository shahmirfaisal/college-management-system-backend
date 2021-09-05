const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const classRoutes = require("./routes/class");
const studentRoutes = require("./routes/student");
const teacherRoutes = require("./routes/teacher");
const adminRoutes = require("./routes/admin");

const app = express();

app.use(express.json());

app.use("/student", studentRoutes);
app.use("/teacher", teacherRoutes);
app.use("/class", classRoutes);
app.use("/admin", adminRoutes);

app.use((error, req, res, next) => {
  res.status(error.status).json({ message: error.message });
});

const port = process.env.PORT || 3000;

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    app.listen(port, () => console.log("Listening at 3000!"));
  } catch (error) {
    console.log(error);
  }
})();
