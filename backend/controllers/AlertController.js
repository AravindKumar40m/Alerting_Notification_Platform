const Alert = require("../models/AlertModel");
const VisibilityResolver = require("../services/VisibilityResolver");

// Create a new alert

exports.createAlert = async (req, res) => {
  try {
    const alert = new Alert(req.body);
    await alert.save();
    res.status(201).json(alert);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// update/ Archive alert

exports.updateAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!alert) {
      return res.status(404).json({ error: "Alert not found" });
    }
    res.status(200).json(alert);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// List alerts (Admin: all, filterable)

exports.listAlerts = async (req, res) => {
  try {
    const { severity, status, audience } = req.query;
    let query = {};
    if (status) {
      if (status === "expired") {
        query.isActive = false;
      } else if (status === "active") {
        query.isActive = true;
      }
      // If status="all", no filter on isActive
    } else {
      // Default to active
      query.isActive = true;
    }
    if (severity) query.severity = severity;
    if (audience) query["visibility.type"] = audience;

    const alerts = await Alert.find(query);

    // const alertWithStats = await Promise.all(
    //   alerts.map(async (alert) => {
    //     const snoozedCount = await userAlertPreferences.countDocuments({
    //       alert: alert._id,
    //       status: "snoozed",
    //     });
    //     return { ...alert.toObject(), snoozedBy: snoozedCount };
    //   })
    // );

    // Temporarily set snoozedBy to 0 until UserAlertPreferences model is imported/fixed
    const alertWithStats = alerts.map((alert) => ({
      ...alert.toObject(),
      snoozedBy: 0, // Placeholder; replace with actual count once model is available
    }));
    res.status(200).json(alertWithStats);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
