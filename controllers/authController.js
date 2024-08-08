const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connectDB = require("../config/db");
const mongoose = require("mongoose");
const getUserModel = (db) => require("../models/User")(db);

exports.register = async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;

  try {
    const connection = await connectDB("test");
    const User = getUserModel(connection);

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({
      name,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    const connection2 = await connectDB(`db_${user.id}`);
    const Customer = require("../models/User")(connection2);
    let initialCustomer = new Customer({
      name,
      customer_id: 1,
      phone_number: phoneNumber,
      email,
    });
    initialCustomer.password = await bcrypt.hash(password, salt);

    await initialCustomer.save();
    const payload = {
      user: {
        id: user.id,
        dbName: `db_${user.id}`,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
      if (err) throw err;
      res.json({ token, userID: payload.user.id });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const connection = await connectDB("test");
    const User = getUserModel(connection);
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id,
        dbName: `db_${user.id}`,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
      if (err) throw err;
      res.json({ token, userID: payload.user.id });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
