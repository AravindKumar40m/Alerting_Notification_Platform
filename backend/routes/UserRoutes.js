const express = require("express");
const {
  getUserAlerts,
  markRead,
  snoozeAlert,
} = require("../controllers/UserController");
const router = express.Router();

router.get("/alerts/", getUserAlerts);
router.put("/alerts/:id/read", markRead);
router.put("/alerts/:id/snooze", snoozeAlert);

module.exports = router;
