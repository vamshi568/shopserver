const mongoose = require("mongoose");
const connectDB = require("../config/db");

const getMeasurementModel = (db) => require("../models/Measurement")(db);
const getCustomerModel = (db) => require("../models/Customer")(db);

exports.createMeasurement = async (req, res) => {
  const { customer_id, shirt_measurements, pants_measurements } = req.body;
  const dbName = req.user.dbName; 

  try {
    const connection=await connectDB(dbName);
    const Measurement = getMeasurementModel(connection);
    const Customer = getCustomerModel(connection);
    
    const measurement = new Measurement({ customer_id, shirt_measurements, pants_measurements });
    await measurement.save();

    const customer = await Customer.findOne({ customer_id: customer_id });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    customer.measurements.unshift(measurement._id);
    await customer.save();

    res.json(measurement);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getMeasurements = async (req, res) => {
  const dbName = req.user.dbName; 

  try {
    const connection=await connectDB(dbName);
    const Measurement = getMeasurementModel(connection);
    const measurements = await Measurement.find().populate('customer_id');
    res.json(measurements);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getMeasurementById = async (req, res) => {
  const dbName = req.user.dbName; 

  try {
    const connection=await connectDB(dbName);
    const Measurement = getMeasurementModel(connection);
    const measurement = await Measurement.findById(req.params.id).populate('customer_id');
    if (!measurement) {
      return res.status(404).json({ message: 'Measurement not found' });
    }
    res.json(measurement);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateMeasurement = async (req, res) => {
  const { shirt_measurements, pants_measurements } = req.body;
  const dbName = req.user.dbName; 

  try {
    const connection=await connectDB(dbName);
    const Measurement = getMeasurementModel(connection);
    const measurement = await Measurement.findById(req.params.id);
    if (!measurement) {
      return res.status(404).json({ message: 'Measurement not found' });
    }

    measurement.shirt_measurements = shirt_measurements || measurement.shirt_measurements;
    measurement.pants_measurements = pants_measurements || measurement.pants_measurements;

    await measurement.save();
    res.json(measurement);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteMeasurement = async (req, res) => {
  const dbName = req.user.dbName; 

  try {
    const connection = await connectDB(dbName);
    const Measurement = getMeasurementModel(connection);
    const measurement = await Measurement.findById(req.params.id);
    if (!measurement) {
      return res.status(404).json({ message: 'Measurement not found' });
    }

    await measurement.remove();
    res.json({ message: 'Measurement removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
