const mongoose = require("mongoose");
const User = require("./models/UserModel");
const Team = require("./models/TeamModel");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI);

async function seed() {
  await Team.deleteMany({});
  await User.deleteMany({});

  const engineering = await new Team({ id: "eng", name: "Engineering" }).save();
  const marketing = await new Team({ id: "mkt", name: "Marketing" }).save();

  await new User({ id: "admin1", name: "Admin User", role: "Admin" }).save();
  await new User({
    id: "user1",
    name: "Eng User",
    team: engineering._id,
  }).save();
  await new User({ id: "user2", name: "Mkt User", team: marketing._id }).save();

  console.log("Seeded!");
  mongoose.disconnect();
}

seed();
