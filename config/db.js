// const mongoose = require("mongoose");

// const connectDB = async (dbName) => {
//   try {
//     const dbUri = `${process.env.MONGO_URI}${dbName}?retryWrites=true&w=majority&appName=Cluster0`;
//     const db = mongoose.createConnection(dbUri,);
//     console.log(`Connected to database: ${dbName}`);
//     return db
//   } catch (err) {
//     console.error(err.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;

const mongoose = require("mongoose");

const connections = {}; // To store connections for each tenant

const connectDB = async (dbName) => {
  if (connections[dbName]) {
    // Return existing connection if it exists
    return connections[dbName];
  }

  const uri = process.env.MONGO_URI;
  const connection = await mongoose
    .createConnection(uri, {
      // poolSize: 10,
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    })
    .asPromise();
  console.log("connected to database: ", dbName);
  connections[dbName] = connection.useDb(dbName);
  return connections[dbName];
};

module.exports = connectDB;
