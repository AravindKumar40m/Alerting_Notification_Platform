const mongoose = require("mongoose");

const userAlertPreferenceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    alert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Alert",
      required: true,
    },
    status: {
      type: String,
      enum: ["unread", "read", "snoozed"],
      default: "unread",
    },
    snoozedUntil: { type: Date },
    updateAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "UserAlertPreference",
  userAlertPreferenceSchema
);
