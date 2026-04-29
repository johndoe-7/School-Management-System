CREATE DATABASE IF NOT EXISTS school_management;
USE school_management;

CREATE TABLE schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school_id INT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'school_admin', 'teacher', 'other_staff') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
);


CREATE TABLE master_mediums (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);


CREATE TABLE school_mediums (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school_id INT NOT NULL,
    master_medium_id INT NOT NULL,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (master_medium_id) REFERENCES master_mediums(id) ON DELETE CASCADE,
    UNIQUE KEY (school_id, master_medium_id)
);


CREATE TABLE shifts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school_id INT NOT NULL,
    shift_name ENUM('Morning', 'Noon') NOT NULL,
    start_time TIME,
    end_time TIME,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
);


CREATE TABLE master_classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);


CREATE TABLE school_classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school_id INT NOT NULL,
    master_class_id INT NOT NULL,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (master_class_id) REFERENCES master_classes(id) ON DELETE CASCADE,
    UNIQUE KEY (school_id, master_class_id)
);

CREATE TABLE sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school_id INT NOT NULL,
    name VARCHAR(10) NOT NULL,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    UNIQUE KEY (school_id, name)
);


CREATE TABLE academic_years (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INT GENERATED ALWAYS AS (DATEDIFF(end_date, start_date)) STORED,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
);


CREATE TABLE batches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school_class_id INT NOT NULL,
    section_id INT NOT NULL,
    shift_id INT NULL,
    academic_year_id INT NOT NULL,
    batch_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (school_class_id) REFERENCES school_classes(id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE,
    FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE SET NULL,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE,
    UNIQUE KEY (school_class_id, section_id, academic_year_id)
);


CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school_id INT NOT NULL,
    batch_id INT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    enrollment_number VARCHAR(100) UNIQUE,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE SET NULL
);

CREATE TABLE gate_passes (
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
);

CREATE TABLE school_subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50),
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
);

CREATE TABLE exams (
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
);

CREATE TABLE exam_subjects (
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
);

CREATE TABLE grade_systems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school_id INT NOT NULL,
    grade_name VARCHAR(10) NOT NULL,
    min_percent DECIMAL(5,2) NOT NULL,
    max_percent DECIMAL(5,2) NOT NULL,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
);

CREATE TABLE exam_marks (
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
);

CREATE TABLE exam_results (
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
);
