const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose.set("strictQuery", true);
  // enables stricter query validation in Mongoose
  // helps catch potential errors related to typos or incorrect query syntax early on

  const connect = await mongoose.connect(process.env.MONGO_URL);

  console.log(`MongoDB Connected : ${connect.connection.host}`);
};

module.exports = connectDB;
