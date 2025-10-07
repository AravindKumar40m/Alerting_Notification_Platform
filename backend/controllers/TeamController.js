const Team = require("../models/TeamModel");
const User = require("../models/UserModel");

const getTeams = async (req, res) => {
  const teams = await Team.find({}, "id name");
  res.json(teams);
};

const getUsers = async (req, res) => {
  const users = await User.find({ role: "User" }, "id name email");
  res.json(users);
};

module.exports = { getTeams, getUsers };
