const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  customer_id: { type: Number },
  name: { type: String },
  phone_number: { type: String },
  profile_pic: { type: String },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  measurements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Measurement' }],
  other_details: { type: String },
  created_at: { type: Date, default: Date.now }
}); 
module.exports = (db) => {
  return db ? db.model('Customer', customerSchema) :customerSchema;
}