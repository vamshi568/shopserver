const { default: mongoose } = require("mongoose");
const Customer = require("../models/Customer");

exports.createCustomer = async (req, res) => {
  const {
    name,
    phone_number,
    customer_id,
    profile_pic,
    other_details,
    measurements,
  } = req.body;
  try {
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

exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      customer_id: req.params.id,
    }).populate("orders measurements");
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
  try {
    const customer = await Customer.findOne({ customer_id: req.params.id });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    customer.name = name || customer.name;
    customer.phone_number = phone_number || customer.phone_number;
    customer.profile_pic = profile_pic || customer.profile_pic;
    customer.other_details = other_details || customer.other_details;
    if (orders ) {
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
  try {
    const customer = await Customer.findOne({ customers_id: req.params.id });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    await customer.remove();
    res.json({ message: "Customer removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
