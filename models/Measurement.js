const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  shirt_measurements: {
    neck: Number,
    chest: Number,
    waist: Number,
    sleeve_length: Number,
    shoulder_width: Number
  },
  pants_measurements: {
    waist: Number,
    hip: Number,
    inseam: Number,
    outseam: Number,
    thigh: Number
  },
  date_taken: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Measurement', measurementSchema);
