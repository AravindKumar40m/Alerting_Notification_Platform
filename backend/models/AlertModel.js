const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    severity: {
      type: String,
      enum: ["Info", "Warning", "Critical"],
      required: true,
    },
    deliveryType: { type: String, default: "In-App" },
    remainderFrequency: { type: String, default: 2 },
    startTime: { type: Date, default: Date.now },
    expiryTime: { type: Date, required: true },
    visibility: {
      type: {
        type: String,
        enum: ["Organization", "Team", "User"],
        required: true,
      },
      target: { type: [String] },
    },
    isActive: { type: Boolean, default: true },
    isRemainderEnable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", alertSchema);
