const express = require("express");
const router = express.Router();
const gatepassController = require("../controllers/gatepassController");
const { authMiddleware, staffOnly } = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.post("/", gatepassController.createGatepass);
router.get("/", gatepassController.getGatepasses);
router.get("/:id", gatepassController.getGatepassById);
router.put("/:id/status", staffOnly, gatepassController.updateStatus);

module.exports = router;
