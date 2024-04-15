const express = require("express");
const dotenv = require("dotenv");
const bookings = require("./routes/booking");
const dentists = require("./routes/dentist");
const connectDB = require("./config/db");
const auth = require('./routes/auth');
const cookieParser=require('cookie-parser');

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect Database
connectDB();

const app = express();

// Body parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());

// Mount routers
app.use("/api/v1/bookings", bookings);
app.use("/api/v1/dentists", dentists);
app.use('/api/v1/auth',auth);

const PORT = process.env.PORT || 5200;
const server = app.listen(
  PORT,
  console.log(
    "Server is running in",
    process.env.NODE_ENV,
    "mode on port",
    PORT
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error : ${err.message}`);

  // close server & exit process
  server.close(() => process.exit(1));
});
