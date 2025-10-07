const express = require("express");
const { getTeams, getUsers } = require("../controllers/TeamController");
const router = express.Router();

router.get("/teams", getTeams);
router.get("/users", getUsers);

module.exports = router;
