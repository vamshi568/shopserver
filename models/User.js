const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  phoneNumber: {
    type: String
  }
  ,
  shopName: {
    type: String
  },
  shopAddress: {
    type: mongoose.Schema.Types.Mixed
  },
  shopPhoto: {
    type: String
  },
  profilePhoto: {
    type: String
  },
  aboutUs: {
    type: String
  }
});
module.exports = (db) => {
  return db ? db.model('User', userSchema):  
    userSchema
  
};
