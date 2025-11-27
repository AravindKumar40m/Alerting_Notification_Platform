const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const JWT_SECRET = process.env.JWT_SECRET;

const register = async (req, res) => {
  try {
    // console.log(req.body);

    const { email, password, name, role, team } = req.body;
    const existingUser = await User.findOne({ email });
    UAdata = {};
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });
    if (role === "Admin") {
      UAdata = { email, password, name, role };
    } else {
      UAdata = { email, password, name, role, team };
    }
    // console.log(UAdata);

    const user = new User(UAdata);
    await user.save();
    // console.log(user);

    const token = jwt.sign(
      { _id: user._id.toString(), role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );
    // console.log(token);

    res.status(201).json({
      token,
      user: {
        _id: user._id.toString(),
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
    // console.log(req.body);

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    // console.log(user);

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // console.log(user.role);

    const token = jwt.sign(
      { _id: user._id.toString(), role: user.role },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res.json({
      token,
      user: {
        _id: user._id.toString(),
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
