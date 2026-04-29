const express = require('express');
const router = express.Router();
const schoolAdminController = require('../controllers/schoolAdminController');

router.get('/shifts', schoolAdminController.getShifts);
router.post('/shifts', schoolAdminController.createShift);

router.get('/sections', schoolAdminController.getSections);
router.post('/sections', schoolAdminController.createSection);

router.get('/school-classes', schoolAdminController.getSchoolClasses);
router.post('/school-classes', schoolAdminController.createSchoolClass);

router.get('/batches', schoolAdminController.getBatches);
router.post('/batches', schoolAdminController.createBatch);

router.get('/school-mediums', schoolAdminController.getSchoolMediums);
router.post('/school-mediums', schoolAdminController.createSchoolMedium);

router.get('/academic-years', schoolAdminController.getAcademicYears);
router.post('/academic-years', schoolAdminController.createAcademicYear);

router.get('/students', schoolAdminController.getStudents);
router.post('/students', schoolAdminController.createStudent);

module.exports = router;
