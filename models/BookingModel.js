const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  bookingDate: {
    type: Date,
    required: true,
  },
  user: {
    // type: mongoose.Schema.ObjectId,
    // ref: "User",
    type: String,
    required: true,
  },
  dentist: {
    // type: mongoose.Schema.ObjectId,
    // ref: "Dentist",
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Booking", BookingSchema);
