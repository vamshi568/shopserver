const mongoose = require("mongoose");
const connectDB = require("../config/db");

const getOrderModel = (db) => require("../models/Order")(db);
const getCustomerModel = (db) => require("../models/Customer")(db);

exports.createOrder = async (req, res) => {
  const {
    customer_id,
    delivery_date,
    additional_details,
    photos,
    type_cloth,
    status,
    isUrgent,
  } = req.body;
  const dbName = req.user.dbName; 

  try {
    const connection = await connectDB(dbName);
    const Order = getOrderModel(connection);
    const Customer = getCustomerModel(connection);
    
    const order = new Order({
      customer_id,
      delivery_date,
      additional_details,
      photos,
      type_cloth,
      status,
      isUrgent,
    });
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getOrders = async (req, res) => {
  const dbName = req.user.dbName; 

  try {
    const connection = await connectDB(dbName);
    const Order = getOrderModel(connection);
    const orders = await Order.find().populate("customer_id");
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getOrderById = async (req, res) => {
  const dbName = req.user.dbName; 

  try {
    const connection = await connectDB(dbName);
    const Order = getOrderModel(connection);
    const Customer = getCustomerModel(connection);

    const order = await Order.findById(req.params.id).populate("customer_id");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const customer = await Customer.findOne({ customer_id: order.customer_id });
    const now = new Date();
    const deliveryDate = new Date(order.delivery_date);
    const timeDifference = deliveryDate - now;
    const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    const populatedOrder = {
      ...order.toJSON(),
      customerName: customer.name,
      phone_number: customer.phone_number,
      profile_pic: customer.profile_pic,
      daysLeft,
    };
    res.json(populatedOrder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.updateOrder = async (req, res) => {
  const {
    order_date,
    delivery_date,
    additional_details,
    status,
    photos,
    type_cloth,
    isUrgent,
  } = req.body;
  const dbName = req.user.dbName; 

  try {
    const connection = await connectDB(dbName);
    const Order = getOrderModel(connection);

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.order_date = order_date || order.order_date;
    order.delivery_date = delivery_date || order.delivery_date;
    order.additional_details = additional_details || order.additional_details;
    order.status = status || order.status;
    order.photos = photos || order.photos;
    order.type_cloth = type_cloth || order.type_cloth;
    order.updated_at = Date.now(); 
    order.isUrgent = isUrgent || order.isUrgent;

    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.deleteOrder = async (req, res) => {
  const dbName = req.user.dbName; 

  try {
    const connection = await connectDB(dbName);
    const Order = getOrderModel(connection);

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.remove();
    res.json({ message: "Order removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getCompletedOrders = async (req, res) => {
  const dbName = req.user.dbName; 

  try {
    const connection = await connectDB(dbName);
    const Order = getOrderModel(connection);
    const Customer = getCustomerModel(connection);
    const orders = await Order.find({ status: "Completed" }).sort({
      updated_at: -1,
    });
    const populatedOrders = await Promise.all(
      orders.map(async (order) => {
        const customer = await Customer.findOne({
          customer_id: order.customer_id,
        });
        return { ...order.toJSON(), customerName: customer.name };
      })
    );

    res.json(populatedOrders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getIncompleteOrders = async (req, res) => {
  const dbName = req.user.dbName; 

  try {
    const connection = await connectDB(dbName);
    const Order = getOrderModel(connection);
    const Customer = getCustomerModel(connection);

    const orders = await Order.find({ status: "Pending" }).sort({
      delivery_date: 1,
    });
    const populatedOrders = await Promise.all(
      orders.map(async (order) => {
        const customer = await Customer.findOne({
          customer_id: order.customer_id,
        });
        const now = new Date();
        const deliveryDate = new Date(order.delivery_date);
        const timeDifference = deliveryDate - now;
        const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

        return { ...order.toJSON(), customerName: customer.name, daysLeft };
      })
    );
    res.json(populatedOrders);
  } catch (err) {
    console.error(err.message,'populatedOrders');
    res.status(500).send("Server error");
  }
};
exports.getDeleveredOrders = async (req, res) => {
  const dbName = req.user.dbName; 

  try {
    const connection = await connectDB(dbName);
    const Order = getOrderModel(connection);
    const Customer = getCustomerModel(connection);

    const orders = await Order.find({ status: "Delivered" }).sort({
      delivery_date: 1,
    });
    const populatedOrders = await Promise.all(
      orders.map(async (order) => {
        const customer = await Customer.findOne({
          customer_id: order.customer_id,
        });
        const now = new Date();
        const deliveredDate = new Date(order.updated_at);
        const timeDifference = deliveredDate - now;
        const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

        return { ...order.toJSON(), customerName: customer.name, daysLeft };
      })
    );

    res.json(populatedOrders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
