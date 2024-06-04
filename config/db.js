const User = require("../models/User");
const mongoose = require("mongoose");
const Customer = require("../models/Customer");

// const client = new MongoClient(process.env.MONGO_URI, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>console.log('conneted'))
    .catch(err=>console.log(err))

    //   await client.connect();
    // const db = await client.db("ShopDB");
    // const collection = await db.collection("users").find({}).toArray();

    // console.log(collection);
    
    
  } finally {
  }
};

module.exports = connectDB;
