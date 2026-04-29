const express = require("express");
const router = express.Router();
const examController = require("../controllers/examController");

router.post("/", examController.createExam);
router.get("/:schoolId", examController.getExams);

router.post("/subjects", examController.createSubject);
router.get("/subjects/:schoolId", examController.getSubjects);

router.post("/exam-subjects", examController.addExamSubject);
router.get("/exam-subjects/:examId", examController.getExamSubjects);

router.post("/grades", examController.createGrade);
router.get("/grades/:schoolId", examController.getGrades);

router.post("/marks", examController.enterMarks);
router.get("/marks/:examId/:subjectId", examController.getMarks);
router.get("/results/:examId", examController.getExamResults);
router.get("/results/detailed/:examId", examController.getDetailedResults);

module.exports = router;
