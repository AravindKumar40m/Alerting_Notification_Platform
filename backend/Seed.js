const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/UserModel");
const Team = require("./models/TeamModel");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI);

async function seed() {
  await Team.deleteMany({});
  await User.deleteMany({});

  const engineering = await new Team({ id: "eng", name: "Engineering" }).save();
  const marketing = await new Team({ id: "mkt", name: "Marketing" }).save();

  const adminPassword = await bcrypt.hash("adminpass", 10);
  await new User({
    id: "admin1",
    email: "admin@example.com",
    password: adminPassword,
    name: "Admin User",
    role: "Admin",
  }).save();

  const userPassword = await bcrypt.hash("userpass", 10);
  await new User({
    id: "user1",
    email: "eng@example.com",
    password: userPassword,
    name: "Eng User",
    team: engineering._id,
  }).save();
  await new User({
    id: "user2",
    email: "mkt@example.com",
    password: userPassword,
    name: "Mkt User",
    team: marketing._id,
  }).save();

  console.log("Seeded!");
  mongoose.disconnect();
}

seed();
