const express = require('express');
const router = express.Router();
const masterController = require('../controllers/masterController');

router.get('/classes', masterController.getAllMasterClasses);
router.post('/classes', masterController.createMasterClass);

router.get('/mediums', masterController.getAllMasterMediums);
router.post('/mediums', masterController.createMasterMedium);

module.exports = router;
