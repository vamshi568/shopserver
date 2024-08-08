const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
  customer_id: { type: Number },
  shirt_measurements: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  pants_measurements: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  date_taken: { type: Date, default: Date.now }
}, { strict: false });

measurementSchema.set('toObject', { getters: true, minimize: false });
measurementSchema.set('toJSON', { getters: true, minimize: false });

module.exports = (db) => {
  return db ? db.model('Measurement', measurementSchema): measurementSchema;
};
