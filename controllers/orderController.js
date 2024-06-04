const Customer = require("../models/Customer");
const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  const {
    customer_id,
    order_date,
    delivery_date,
    additional_details,
    photos,
    type_cloth,
    status,
  } = req.body;

  try {
    const order = new Order({
      customer_id,
      order_date,
      delivery_date,
      additional_details,
      photos,
      type_cloth,
      status,
    });
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("customer_id");
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("customer_id");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
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
  } = req.body;

  try {
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
    order.updated_at = Date.now(); // Set the updated_at field to the current date and time

    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.deleteOrder = async (req, res) => {
  try {
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

// New endpoint to get completed orders sorted by updated_at
exports.getCompletedOrders = async (req, res) => {
  try {
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
  try {
    const orders = await Order.find({ status: { $ne: "Completed" } }) // Find orders where status is not 'Completed'
      .sort({ delivery_date: 1 }); // Populate customer details
    const populatedOrders = await Promise.all(
      orders.map(async (order) => {
        const customer = await Customer.findOne({
          customer_id: order.customer_id,
        });
        const now = new Date();
        const deliveryDate = new Date(order.delivery_date);
        const timeDifference = deliveryDate - now;
        const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  
        return { ...order.toJSON(), customerName: customer.name,daysLeft };
      })
    );
    res.json(populatedOrders);
  } catch (err) {
    console.error("Error fetching incomplete orders:", err);
    res.status(500).send("Server error");
  }
};
