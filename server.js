const express = require("express");
const dotenv = require("dotenv");
const bookings = require("./routes/booking");

// Load env vars
dotenv.config({ path: "./config/config.env" });

const app = express();

// Mount routers
app.use("/api/v1/bookings", bookings);

const PORT = process.env.PORT || 5100;
app.listen(
  PORT,
  console.log(
    "Server is running in",
    process.env.NODE_ENV,
    "mode on port",
    PORT
  )
);
