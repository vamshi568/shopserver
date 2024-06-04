const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  customer_id:{type:Number, required:true},
  name: { type: String, required: true },
  phone_number: { type: String, required: true },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  measurements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Measurement' }]
});

module.exports = mongoose.model('Customer', customerSchema);
