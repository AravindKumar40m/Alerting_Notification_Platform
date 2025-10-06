const mongoose = require("mongoose");

const notificationDeliverySchema = new mongoose.Schema(
  {
    alert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Alert",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deliveryAt: { type: Date, default: Date.now },
    channel: { type: String, default: "In-App" },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "NotificationDelivery",
  notificationDeliverySchema
);
