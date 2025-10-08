const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const JWT_SECRET = process.env.JWT_SECRET;

const register = async (req, res) => {
  try {
    const { email, password, name, role, teamId } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const user = new User({
      email,
      password,
      name,
      role,
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      team: teamId,
    });
    await user.save();

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    console.log(req.body);

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log(user);

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login };
