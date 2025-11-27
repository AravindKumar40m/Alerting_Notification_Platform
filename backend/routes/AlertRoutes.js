const express = require("express");
const {
  createAlert,
  updateAlert,
  listAlerts,
} = require("../controllers/AlertController");
const {
  authenticate,
  authorizeAdmin,
} = require("../middleware/AuthMiddleware");

const router = express.Router();

// Assume admin check middleware

router.post("/", authenticate, authorizeAdmin, createAlert);
router.put("/:id", authenticate, authorizeAdmin, updateAlert);
router.get("/", authenticate, authorizeAdmin, listAlerts);
router.get();

module.exports = router;
