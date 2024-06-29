const User = require("../models/User");
const mongoose = require("mongoose");
const Customer = require("../models/Customer");

const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>console.log('conneted'))
    .catch(err=>console.log(err))    
  } finally {
  }
};

module.exports = connectDB;
