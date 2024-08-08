const mongoose = require("mongoose");
const connectDB = require("../config/db");

const getUserModel = (db) => require("../models/User")(db);
const getOrderModel = (db) => require("../models/Order")(db);
const getCustomerModel = (db) => require("../models/Customer")(db);

exports.getUserDetails = async (req, res) => {
  const dbName = req.user.dbName; 

  try {
    const connection=await connectDB(dbName);
    const User = getUserModel(connection);
    const Order = getOrderModel(connection);
    const Customer = getCustomerModel(connection);

    const user = await User.find({});
    const orders = await Order.find({});
    const customers = await Customer.find({});
    const completedOrders = await Order.find({ status: 'Completed' });
    const pendingOrders = await Order.find({ status: 'Pending' });

    const totalOrders = orders.length;
    const totalCustomers = customers.length;
    const totalCompletedOrders = completedOrders.length;
    const totalPendingOrders = pendingOrders.length;

    
    res.json({
      user,
      totalOrders,
      totalCustomers,
      totalCompletedOrders,
      totalPendingOrders,
    });
  } catch (err) {
    console.error('Error getting user details:', err);
    res.status(500).send('Server error');
  }
};



exports.saveData = async (req, res) => {
  const dbName = req.user.dbName; 
  const data = req.body;

  try {
    const connection = await connectDB(dbName);
    const User = getUserModel(connection);

    let user = await User.findOne({});

    if (user) {
      user = await User.findOneAndUpdate({}, data, { new: true });
      res.json(user);
    } else {
      user = new User(data);
      await user.save();
      res.json(user);
    }
  } catch (err) {
    console.error('Error saving data:', err);
    
    res.status(500).send('Server error');
  }
};
