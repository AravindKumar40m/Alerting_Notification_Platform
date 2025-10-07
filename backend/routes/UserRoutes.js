const express = require("express");
const {
  getUserAlerts,
  markRead,
  snoozeAlert,
} = require("../controllers/UserController");
const router = express.Router();
const { authenticate } = require("../middleware/AuthMiddleware");

router.get("/alerts/", authenticate, getUserAlerts);
router.put("/alerts/:id/read", authenticate, markRead);
router.put("/alerts/:id/snooze", authenticate, snoozeAlert);

module.exports = router;
