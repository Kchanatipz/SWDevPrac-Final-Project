const express = require("express");
const {
  getAllBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookings");

const router = express.Router();
const {protect, authorize}=require('../middleware/auth');
const app = express();

router.route("/").get(protect,authorize('admin'),getAllBookings).post(protect,createBooking);
router.route("/:id").get(protect,getBooking).put(protect,updateBooking).delete(protect,deleteBooking);

module.exports = router;
