const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
  customer_id: { type: Number, required: true },
  shirt_measurements: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  pants_measurements: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  date_taken: { type: Date, default: Date.now }
}, { strict: false ,id: false});

measurementSchema.set('toObject', { getters: true, minimize: false });
measurementSchema.set('toJSON', { getters: true, minimize: false });



module.exports = mongoose.model('Measurement', measurementSchema);
