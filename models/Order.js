const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer_id: { type: Number },
  order_date: { type: Date, default: Date.now },
  delivery_date: { type: Date },
  additional_details: { type: String },
  photos: { type: [String] },
  type_cloth: { type: String },
  isUrgent: { type: Boolean, default: false },
  status: { type: String, default: "Pending" },
  updated_at: { type: Date, default: Date.now },
});

module.exports = (db) => {
  if (db) {
    return db.model("Order", orderSchema);
  } else {
    return orderSchema
  } 
};
