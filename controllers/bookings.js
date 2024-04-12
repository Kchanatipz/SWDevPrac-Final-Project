const { json } = require("express");
const Booking = require("../models/Booking");

// desc     Get all bookings
// route    GET /api/v1/bookings
// access   Public
exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find();

    res
      .status(200)
      .json({ succes: true, count: bookings.length, data: bookings });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, msg: "Can't find the booking" });
  }
};

// desc     Get single booking
// route    GET /api/v1/bookings/:id
// access   Public
exports.getBooking = async (req, res, next) => {
  // console.log(req);
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(400).json({ success: false, msg: "Booking not found" });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false
    });
  }
};

// desc     Create new booking
// route    POST /api/v1/bookings
// access   Private
exports.createBooking = async (req, res, next) => {
  // console.log(req);

  const booking = await Booking.create(req.body);

  res.status(201).json({ success: true, data: booking });
};

// desc     Update booking
// route    PUT /api/v1/bookings/:id
// access   Private
exports.updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!booking) {
      return res.status(400).json({ success: false, msg: "Booking not found" });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
};

// desc     Delete booking
// route    GET /api/v1/bookings/:id
// access   Private
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(400).json({ succes: false, msg: "Booking not found" });
    }

    res.status(200).json({ succes: true, data: {} });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
};
