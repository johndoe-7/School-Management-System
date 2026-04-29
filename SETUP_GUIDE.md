z# 🏛️ School Management System - Setup Guide

This guide outlines the complete flow for setting up the system from a clean state.

---

## 1. Initial Access (Super Admin)
The system has been reset with a default **Super Admin** account.

- **Login URL**: `http://localhost:5173/` (Root page)
- **Email**: `admin@excelsior.com`
- **Password**: `admin123`

### Tasks for Super Admin:
1. **Create Mediums**: Go to "Master Mediums" and add your school's mediums (e.g., English, Hindi).
2. **Create Classes**: Go to "Master Classes" and define the standard classes (e.g., Class 10, Class 12).
3. **Create Schools (Branches)**: Go to "School Directory" and add your school branches. **Note the Branch IDs** as they are needed for registration.

---

## 2. School Admin Setup
Once branches are created, specific administrators for each school can register themselves.

### Registration Flow:
1. Go to the root page and click **"Don't have an account? Register"**.
2. Select **"Staff"** in the Identity toggle.
3. Choose the correct **School Branch** from the dropdown.
4. Fill in details and click **Create Account**.
5. **Approval**: After registration, the **Super Admin** must log in and change the staff role from `teacher` to `school_admin` in the dashboard to grant full administrative rights for that branch.

---

## 3. Student Onboarding
Students can register themselves or be registered by the School Admin.

### Student Flow:
1. Go to the root page and click **"Register"**.
2. Select **"Student"** in the Identity toggle.
3. Enter your **Enrollment Number** and correct **School Branch**.
4. Once registered, log in to access the **EduPortal**.

---

## 4. Feature Flow: Gatepass System
1. **Student**: Log in to the Student Dashboard → Click "Request Gatepass" → Fill details and submit. Status will be `Pending`.
2. **School Admin**: Log in to the School Admin Dashboard → Navigate to "Gatepass Management" → Click "Process" on the request → Add remarks and Approve/Reject.
3. **Student**: Once approved, click "Show QR Pass" in the dashboard. This QR contains student details and approval status for security verification.

---

## 5. Feature Flow: Exam & Results
1. **School Admin**: Navigate to "Student Management" to ensure students are assigned to classes.
2. **School Admin**: Go to "Exam Management" → Select "Subject-wise Entry" → Choose Class/Section/Subject → Enter marks for all students → Submit.
3. **Automated Result**: The system automatically calculates total marks, percentages, and grades based on predefined logic.

---

## 🧪 Quick Verification Checklist
- [ ] Can login with `admin@excelsior.com`.
- [ ] Created at least one School Branch.
- [ ] Registered a new Staff member for that Branch.
- [ ] Registered a Student for that Branch.
- [ ] Successfully processed a Gatepass request.
