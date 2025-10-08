const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    role: { type: String, enum: ["Admin", "User"], default: "User" },
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", userSchema);
