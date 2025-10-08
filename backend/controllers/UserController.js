const Alert = require("../models/AlertModel");
const userAlertPreferences = require("../models/userAlertPreference");
const NotificationDelivery = require("../models/NotificationDelivery");
const VisibilityResolver = require("../services/VisibilityResolver");
const { AlertStateManager } = require("../services/AlertStateManager");

// Fetch user's alerts

exports.getUserAlerts = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const alerts = await Alert.find({
      isActive: true,
      startTime: { $lte: now },
      expiryTime: { $gte: now },
    });

    const userAlerts = await Promise.all(
      alerts.map(async (alert) => {
        const targets = await VisibilityResolver.resolveTargets(
          alert.visibility,
          userId
        );

        if (!targets.length) return null;

        const pref = await userAlertPreferences.findOne({
          user: userId,
          alert: alert._id,
        });
        const deliveries = await NotificationDelivery.countDocuments({
          user: userId,
          alert: alert._id,
        });
        return {
          ...alert.toObject(),
          status: pref?.status || "unread",
          deliveryCount: deliveries,
        };
      })
    ).then((results) => results.filter(Boolean));

    res.status(200).json(userAlerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark read

exports.markRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const state = await AlertStateManager.getState(userId, req.params.id);
    state.markRead();
    res.json({ status: "read" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Snooze alert
exports.snoozeAlert = async (req, res) => {
  try {
    const userId = req.user.id;
    const state = await AlertStateManager.getState(userId, req.params.id);
    state.snoose();
    res.json({ status: "snoozed" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
