const db = require("./config/db");

async function migrate() {
  try {
    console.log("Starting Gatepass migration...");

    // Add fields to students table if they don't exist
    try {
      await db.query(`
        ALTER TABLE students 
        ADD COLUMN email VARCHAR(255) UNIQUE AFTER enrollment_number,
        ADD COLUMN password_hash VARCHAR(255) AFTER email
      `);
      console.log("Added email and password_hash to students table.");
    } catch (err) {
      console.log("Email/password_hash might already exist in students table.");
    }

    // Create gate_passes table
    await db.query(`
      CREATE TABLE IF NOT EXISTS gate_passes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        accompany_type ENUM('Father', 'Mother', 'Sister', 'Brother', 'Guardian', 'Other') NOT NULL,
        out_date DATE NOT NULL,
        out_time TIME NOT NULL,
        purpose TEXT NOT NULL,
        document_url VARCHAR(255),
        request_status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
        approved_by INT NULL,
        approved_at TIMESTAMP NULL,
        remarks TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_by_staff_id INT NULL,
        updated_by_staff_id INT NULL,
        created_by_student_id INT NULL,
        updated_by_student_id INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
        FOREIGN KEY (approved_by) REFERENCES staff(id) ON DELETE SET NULL,
        FOREIGN KEY (created_by_staff_id) REFERENCES staff(id) ON DELETE SET NULL,
        FOREIGN KEY (updated_by_staff_id) REFERENCES staff(id) ON DELETE SET NULL,
        FOREIGN KEY (created_by_student_id) REFERENCES students(id) ON DELETE SET NULL,
        FOREIGN KEY (updated_by_student_id) REFERENCES students(id) ON DELETE SET NULL
      )
    `);
    console.log("Gate_passes table created successfully.");

    console.log("Migration finished!");
  } catch (error) {
    console.error("Migration failed:", error.message);
  } finally {
    process.exit(0);
  }
}

migrate();
