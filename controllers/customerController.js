const mongoose = require("mongoose");
const connectDB = require("../config/db");

const getCustomerModel = (db) => require("../models/Customer")(db);
const getOrderModel = (db) => require("../models/Order")(db);
const getMeasurementModel = (db) => require("../models/Measurement")(db);

exports.createCustomer = async (req, res) => {
  const {
    name,
    phone_number,
    customer_id,
    profile_pic,
    other_details,
    measurements,
  } = req.body;
  const dbName = req.user.dbName; 

  try {
    const connection = await connectDB(dbName);
    const Customer = getCustomerModel(connection);
    const customer = new Customer({
      name,
      phone_number,
      customer_id,
      profile_pic,
      other_details,
      measurements: [measurements],
    });
    await customer.save();
    res.json(customer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
exports.searchuser = async (req, res) => {
  const { search } = req.query;
  const dbName = req.user.dbName;
  const connection = await connectDB(dbName);
  const Customer = getCustomerModel(connection);

  const collections = connection.models;

  try {
    const searchNumber = parseInt(search, 10);
    if (isNaN(searchNumber)) {
      const query = new RegExp(search, "i");
      const customers = await Customer.find({ name: query });
      return res.json(customers);
    }
    const customers = await Customer.find({
      $or: [{ customer_id: searchNumber }, { phone_number: searchNumber }],
    });
    res.json(customers);
  } catch (err) {
    res.status(404).json({ err: "Customers not found" });
  }
};

exports.getCustomers = async (req, res) => {
  const dbName = req.user.dbName;

  try {
    const connection = await connectDB(dbName);
    const Customer = getCustomerModel(connection);
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getCustomerById = async (req, res) => {
  const dbName = req.user.dbName; 

  try {
    const connection = await connectDB(dbName);
    const Customer = getCustomerModel(connection);
    const Order = connection.model("Order", require("../models/Order")());
    const Measurement = connection.model("Measurement", require("../models/Measurement")());
    const customer = await Customer.findOne({
      customer_id: req.params.id,
    })
      .populate({
        path: "orders",
        options: { sort: { updated_at: -1 } },
        model: Order,
      })
      .populate({
        path: "measurements",
        options: { sort: { date_taken: -1 } },
        model:Measurement,
      });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found " });
    }
    res.json(customer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.updateCustomer = async (req, res) => {
  const { name, phone_number, profile_pic, other_details, orders } = req.body;
  const dbName = req.user.dbName; 

  try {
    const connection = await connectDB(dbName);
    const Customer = getCustomerModel(connection);
    const customer = await Customer.findOne({ customer_id: req.params.id });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    customer.name = name || customer.name;
    customer.phone_number = phone_number || customer.phone_number;
    customer.profile_pic = profile_pic || customer.profile_pic;
    customer.other_details = other_details || customer.other_details;
    if (orders) {
      customer.orders.push(new mongoose.Types.ObjectId(orders));
    }
    await customer.save();
    res.json(customer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.deleteCustomer = async (req, res) => {
  const customerId = parseInt(req.params.id, 10);
  const dbName = req.user.dbName; 

  if (isNaN(customerId)) {
    return res.status(400).json({ message: "Invalid customer ID" });
  }

  try {
    const connection = await connectDB(dbName);
    const Customer = getCustomerModel(connection);
    const customer = await Customer.findOne({ customer_id: customerId });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const Order = getOrderModel(connection);
    const Measurement = getMeasurementModel(connection);

    await Promise.all([
      Order.deleteMany({ customer_id: customerId }),
      Measurement.deleteMany({ customer_id: customerId }),
    ]);
    await Customer.deleteOne({ customer_id: customerId });

    res.json({ message: "Customer removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
