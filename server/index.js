const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("School Management API is running...");
});

const schoolRoutes = require("./routes/schoolRoutes");
const masterRoutes = require("./routes/masterRoutes");
const schoolAdminRoutes = require("./routes/schoolAdminRoutes");
const staffRoutes = require("./routes/staffRoutes");
const examRoutes = require("./routes/examRoutes");
const authRoutes = require("./routes/authRoutes");
const gatepassRoutes = require("./routes/gatepassRoutes");

app.use("/api/schools", schoolRoutes);
app.use("/api/master", masterRoutes);
app.use("/api/school-admin", schoolAdminRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/gatepass", gatepassRoutes);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    const connection = await db.getConnection();
    console.log("Database connected successfully!");
    connection.release();
  } catch (err) {
    console.error(
      "Database connection failed. Ensure MySQL is running and credentials are correct.",
      err.message,
    );
  }
});
