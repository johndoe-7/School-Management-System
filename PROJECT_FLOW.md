# School Management System (EduManage Pro) - Project Flow

EduManage Pro is a high-performance, premium school management system designed for seamless administrative and student workflows. Below is the comprehensive architectural and operational flow of the system.

## 1. System Architecture
- **Frontend**: React (Vite) with a custom Glassmorphic design system.
- **Backend**: Node.js (Express) with JWT-based authentication.
- **Database**: MySQL for structured data persistence.
- **Key Modules**: Authentication, Multi-level Administration, Student Management, Academic Structuring (Batches/Sections), Examination, and the Gatepass Engine.

---

## 2. User Entry & Authentication Flow

### A. The Landing Experience
- Users land on a premium home page where they select their role or portal.
- **Flow**: Home Page -> Portal Selection (Super Admin / School Admin / Student / Staff).

### B. Login & Role-Based Redirection
- Users authenticate via the `/login` route.
- **JWT Integration**: Upon successful login, the server issues a JWT token containing user identity and role.
- **Redirection**:
  - `super_admin` -> `/super-admin`
  - `school_admin` / `staff` -> `/school-admin`
  - `student` -> `/student-dashboard`

---

## 3. Administrative Operational Flow

### Phase 1: Global Setup (Super Admin)
1. **Master Data**: Define global classes (e.g., 10th, 12th) and mediums (English, Hindi).
2. **School Onboarding**: Register new school branches in the system.

### Phase 2: Branch Configuration (School Admin)
1. **Mapping**: Import Master Classes and Mediums into the specific branch context.
2. **Parameters**: Define local Sections (A, B, C) and Shifts (Morning, Afternoon).
3. **Academic Calendar**: Create Academic Years (e.g., 2024-2025).
4. **Batch Generation**: Synthesize Class + Section + Shift + Academic Year into a single "Batch" entity.

---

## 4. Academic & Student Management Flow

### A. Staff Management
- School Admins create accounts for teachers and administrative staff.

### B. Student Lifecycle
1. **Enrollment**: Students are enrolled and assigned to a specific **Batch**.
2. **Portal Access**: Students receive credentials to access their personalized dashboard.

### C. Examination & Results
1. **Exam Setup**: Create exam types (Finals, Mid-terms) and define subjects.
2. **Marks Entry**: Staff enters marks for students in their assigned batches.
3. **Automated Grading**: The system calculates percentages and assigns grades (A, B, C, etc.) based on predefined logic.

---

## 5. The Gatepass Engine (Core Workflow)

The Gatepass module handles student leaves with full accountability and security verification via QR codes.

1. **Request (Student)**: 
   - Student logs in and submits a Gatepass request (Reason, Accompany Type, Date/Time).
   - Status: `Pending`.
2. **Approval (Admin/Staff)**:
   - Admin reviews the request in the "Gatepass Review" tab.
   - Admin provides remarks and updates status to `Approved` or `Rejected`.
3. **Verification (Security/Gate)**:
   - Approved students get a **Dynamic QR Code** in their portal.
   - The QR code contains a JSON payload of the student's profile (Name, Batch, Enrollment ID).
   - Security scans the QR to verify identity and leave authorization.

---

## 6. Seamless UX Enhancements
- **Glassmorphic UI**: High-end visual hierarchy using backdrop filters and mesh gradients.
- **Instant Feedback**: Toast notifications for every action.
- **State Persistence**: Active tabs and session data are stored to prevent context loss on refresh.
- **Responsive Layouts**: Sidebars and grids adapt to the user's focus area.
