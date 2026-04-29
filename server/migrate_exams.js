require("dotenv").config();
process.env.DB_NAME = "school_management";
const db = require("./config/db");

async function migrate() {
  try {
    console.log("Starting exam module migration...");

    await db.query(`
      CREATE TABLE IF NOT EXISTS students (
          id INT AUTO_INCREMENT PRIMARY KEY,
          school_id INT NOT NULL,
          batch_id INT NULL,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          enrollment_number VARCHAR(100) UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
          FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE SET NULL
      )
    `);
    console.log("students table created or exists");

    await db.query(`
      CREATE TABLE IF NOT EXISTS school_subjects (
          id INT AUTO_INCREMENT PRIMARY KEY,
          school_id INT NOT NULL,
          name VARCHAR(100) NOT NULL,
          code VARCHAR(50),
          FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
      )
    `);
    console.log("school_subjects table created or exists");

    await db.query(`
      CREATE TABLE IF NOT EXISTS exams (
          id INT AUTO_INCREMENT PRIMARY KEY,
          school_id INT NOT NULL,
          academic_year_id INT NOT NULL,
          name VARCHAR(255) NOT NULL,
          start_date DATE,
          end_date DATE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
          FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE
      )
    `);
    console.log("exams table created or exists");

    await db.query(`
      CREATE TABLE IF NOT EXISTS exam_subjects (
          id INT AUTO_INCREMENT PRIMARY KEY,
          exam_id INT NOT NULL,
          subject_id INT NOT NULL,
          is_theory BOOLEAN DEFAULT TRUE,
          is_practical BOOLEAN DEFAULT FALSE,
          max_theory_marks DECIMAL(5,2) DEFAULT 0.00,
          max_practical_marks DECIMAL(5,2) DEFAULT 0.00,
          total_max_marks DECIMAL(5,2) GENERATED ALWAYS AS (max_theory_marks + max_practical_marks) STORED,
          FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
          FOREIGN KEY (subject_id) REFERENCES school_subjects(id) ON DELETE CASCADE,
          UNIQUE KEY (exam_id, subject_id)
      )
    `);
    console.log("exam_subjects table created or exists");

    await db.query(`
      CREATE TABLE IF NOT EXISTS grade_systems (
          id INT AUTO_INCREMENT PRIMARY KEY,
          school_id INT NOT NULL,
          grade_name VARCHAR(10) NOT NULL,
          min_percent DECIMAL(5,2) NOT NULL,
          max_percent DECIMAL(5,2) NOT NULL,
          FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
      )
    `);
    console.log("grade_systems table created or exists");

    await db.query(`
      CREATE TABLE IF NOT EXISTS exam_marks (
          id INT AUTO_INCREMENT PRIMARY KEY,
          exam_id INT NOT NULL,
          subject_id INT NOT NULL,
          student_id INT NOT NULL,
          theory_marks DECIMAL(5,2) DEFAULT 0.00,
          practical_marks DECIMAL(5,2) DEFAULT 0.00,
          total_marks DECIMAL(5,2) GENERATED ALWAYS AS (theory_marks + practical_marks) STORED,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
          FOREIGN KEY (subject_id) REFERENCES school_subjects(id) ON DELETE CASCADE,
          FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
          UNIQUE KEY (exam_id, subject_id, student_id)
      )
    `);
    console.log("exam_marks table created or exists");

    await db.query(`
      CREATE TABLE IF NOT EXISTS exam_results (
          id INT AUTO_INCREMENT PRIMARY KEY,
          exam_id INT NOT NULL,
          student_id INT NOT NULL,
          total_obtained_marks DECIMAL(8,2) DEFAULT 0.00,
          total_max_marks DECIMAL(8,2) DEFAULT 0.00,
          percentage DECIMAL(5,2) DEFAULT 0.00,
          grade VARCHAR(10),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
          FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
          UNIQUE KEY (exam_id, student_id)
      )
    `);
    console.log("exam_results table created or exists");

    console.log("Finished exam module migration!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    process.exit(0);
  }
}

migrate();
