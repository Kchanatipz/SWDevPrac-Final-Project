// desc     Get all bookings
// route    GET /api/v1/bookings
// access   Public
exports.getAllBookings = async (req, res, next) => {
  res.status(200).json({ success: true, msg: "Show all boookings" });
};

// desc     Get single booking
// route    GET /api/v1/bookings/:id
// access   Public
exports.getBooking = async (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Show boooking ${req.params.id}` });
};

// desc     Create new booking
// route    POST /api/v1/bookings
// access   Private
exports.createBooking = async (req, res, next) => {
  res.status(200).json({ success: true, msg: "Create new boooking" });
};

// desc     Update booking
// route    PUT /api/v1/bookings/:id
// access   Private
exports.updateBooking = async (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Update booking ${req.params.id}` });
};

// desc     Delete booking
// route    GET /api/v1/bookings/:id
// access   Private
exports.deleteBooking = async (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete booking ${req.params.id}` });
};
