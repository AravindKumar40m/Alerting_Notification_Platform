const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const RemainderScheduler = require("./services/RemainderScheduler");
const alertRoutes = require("./routes/AlertRoutes");
const userRoutes = require("./routes/UserRoutes");
const analyticRoutes = require("./routes/AnalyticsRoutes");
const authRoutes = require("./routes/AuthRoutes");
const teamRoutes = require("./routes/TeamRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/user", userRoutes);
app.use("/api/analytics", analyticRoutes);
app.use("/api", teamRoutes);

RemainderScheduler.start();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
