const express = require("express");
const { getAnalytics } = require("../controllers/AnalyticsController");
const {
  authenticate,
  authorizeAdmin,
} = require("../middleware/AuthMiddleware");
const router = express.Router();

router.get("/", authenticate, authorizeAdmin, getAnalytics);

module.exports = router;
