const Customer = require("../models/Customer");
const Order = require("../models/Order");
const User = require("../models/User");

//Retrieving user details from user model
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findOne({_id: req.params.id});
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



