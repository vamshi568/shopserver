const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customer_id: { type: Number, required: true },
  order_date: { type: Date,  default: Date.now },
  delivery_date: { type: Date, required: true },
  additional_details: { type: String },
  photos: { type: [String] },
  type_cloth: { type:  String },
  status: { type: String, default: 'Pending' },  // Added status field
  updated_at: { type: Date, default: Date.now } ,
  
});

module.exports = mongoose.model('Order', OrderSchema);
