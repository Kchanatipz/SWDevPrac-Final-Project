const express = require("express");
const {
  getAllBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookingsController");

const router = express.Router();
const app = express();

router.route("/").get(getAllBookings).post(createBooking);
router.route("/:id").get(getBooking).put(updateBooking).delete(deleteBooking);

module.exports = router;
