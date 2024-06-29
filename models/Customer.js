const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  customer_id:{type:Number, required:true},
  name: { type: String, required: true },
  phone_number: { type: String, required: true },
  profile_pic: { type: String },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  measurements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Measurement' }],
  other_details:{type: String},
  created_at: {type: mongoose.Schema.Types.Date, default: Date.now}
});

module.exports = mongoose.model('Customer', customerSchema);
