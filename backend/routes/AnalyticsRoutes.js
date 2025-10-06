const express = require("express");
const { getAnalytics } = require("../controllers/AnalyticsController");
const { isAdmin } = require("../middleware/AuthMiddleware");
const router = express.Router();

router.get("/", isAdmin, getAnalytics);

module.exports = router;
