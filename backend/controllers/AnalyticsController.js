const Alert = require("../models/AlertModel");
const NotificationDelivery = require("../models/NotificationDelivery");
const userAlertPreferences = require("../models/userAlertPreference");

// Analytics
exports.getAnalytics = async (req, res) => {
  try {
    const totalAlerts = await Alert.countDocuments();
    const totalDeliveries = await NotificationDelivery.countDocuments();
    const totalReads = await userAlertPreferences.countDocuments({
      status: "read",
    });
    const totalSnoozes = await userAlertPreferences.countDocuments({
      status: "snoozed",
    });

    // Breakdown by severity
    const severityBreakdown = await Alert.aggregate([
      { $group: { _id: "$severity", count: { $sum: 1 } } },
    ]);
    res.status(200).json({
      metrics: {
        totalAlerts,
        delivered: totalDeliveries,
        read: totalReads,
        snoozed: totalSnoozes,
      },
      severityBreakdown: severityBreakdown,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
