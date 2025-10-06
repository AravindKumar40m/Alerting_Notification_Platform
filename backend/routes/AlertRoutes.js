const express = require("express");
const {
  createAlert,
  updateAlert,
  listAlerts,
} = require("../controllers/AlertController");
const { isAdmin } = require("../middleware/AuthMiddleware");

const router = express.Router();

// Assume admin check middleware

router.post("/", isAdmin, createAlert);
router.put("/:id", isAdmin, updateAlert);
router.get("/", isAdmin, listAlerts);

module.exports = router;
