const db = require("./server/config/db");

async function cleanup() {
  try {
    console.log("Cleaning up students table...");
    await db.query("DELETE FROM students");
    console.log("Cleaning up staff table...");
    await db.query("DELETE FROM staff");

    console.log("Creating default Super Admin...");
    const bcrypt = require("bcryptjs");
    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash("admin123", salt);

    await db.query(
      `
            INSERT INTO staff (first_name, last_name, email, password_hash, role, school_id) 
            VALUES (?, ?, ?, ?, ?, ?)
        `,
      ["Super", "Admin", "admin@excelsior.com", pass, "super_admin", null],
    );

    console.log(
      "Database cleared successfully. Default Super Admin created: admin@excelsior.com / admin123",
    );
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

cleanup();
