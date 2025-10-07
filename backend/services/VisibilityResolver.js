const User = require("../models/UserModel");
const Team = require("../models/TeamModel");

class VisibilityResolver {
  static async resolveTargets(visibility, currentUserId = null) {
    const { type, target } = visibility;
    let targets = [];

    switch (type) {
      case "Organization":
        const allUsers = await User.find({ role: "User" }).select("_id");
        targets = allUsers.map((u) => u._id.toString());
        break;
      case "Team":
        const teams = await Team.find({ id: { $in: target } }).select("_id");
        const teamUsers = await User.find({
          team: { $in: teams.map((t) => t._id), role: "User" },
        }).select("_id");
        targets = teamUsers.map((u) => u._id.toString());
        break;
      case "User":
        targets = target;
        break;
    }

    if (currentUserId) {
      return targets.includes(currentUserId) ? [currentUserId] : [];
    }
    return targets;
  }
}

module.exports = VisibilityResolver;
