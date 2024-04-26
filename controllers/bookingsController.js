const { json } = require("express");
const Booking = require("../models/BookingModel");
const User = require("../models/UserModel");
const { protect, authorize } = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const Dentist=require("../models/DentistModel");

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
    const bookingowner=booking.user;
    //see token
    let token;
    if (req.headers.authorization &&req.headers.authorization.startsWith('Bearer')){
        token=req.headers.authorization.split(' ')[1];
    }

    //Make sure token exists
    if (!token || token=='null'){
        return res.status(401).json({success:false,message:'Not authorize to access this route, Please login'});
    }

    //verify if the user is the owner of this booking
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    const user=await User.findById(decoded.id);
    // console.log(user.id);
    // console.log(bookingowner);
    if (user.role==="user" && user.id!==bookingowner.toString()){
      return res.status(400).json({success:false,msg:"This is not your booking!!"});
    }

    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
    });
  }
};

// desc     Get single booking of this user
// route    GET /api/v1/bookings/mybooking
// access   Private
exports.getBookingofCurrentUser= async (req, res, next) => {
  try{
    //see token
  let token;
  if (req.headers.authorization &&req.headers.authorization.startsWith('Bearer')){
      token=req.headers.authorization.split(' ')[1];
  }

  //Make sure token exists
  if (!token || token=='null'){
      return res.status(401).json({success:false,message:'Login to see your booking'});
  }
  //get the bookingid of this user
  const decoded = jwt.verify(token,process.env.JWT_SECRET);
  const user=await User.findById(decoded.id);
  const booking=await Booking.findById(user.booking);
  return res.status(200).json({success:true,data:booking});
  }catch(err){
    console.log(err);
    res.status(400).json({success:false});
  }
}

// desc     Create new booking
// route    POST /api/v1/bookings
// access   Private
exports.createBooking = async (req, res, next) => {
  //see token
  let token;
  if (req.headers.authorization &&req.headers.authorization.startsWith('Bearer')){
      token=req.headers.authorization.split(' ')[1];
  }

  //Make sure token exists
  if (!token || token=='null'){
      return res.status(401).json({success:false,message:'Not authorize to access this route. Please login'});
  }
  //verify if the user is creating their own booking
  const decoded = jwt.verify(token,process.env.JWT_SECRET);
  const tokenUser=await User.findById(decoded.id);
  if(!req.body.user ||!req.body.dentist || !req.body.bookingDate){
    return res.status(400).json({success:false,msg:"Invalid request body"});
  }
  //Not booking for their own and not an admin
  if (tokenUser.role=="user" && tokenUser.id!==req.body.user){
    return res.status(400).json({success:false,msg:"User token does not match the request. You can only book your own booking."});
  }
  //check if there is the dentist provided
  const dentist=Dentist.findById(req.body.dentist);
  if (!dentist){
    return res.status(400).json({success:false,msg:"Unknown dentist provided."});
  }
  const bookingowner=await User.findById(req.body.user);
  //If user have already booked
  if (bookingowner.booking){
    return res.status(400).json({success:false,msg:"User had already booked."});
  }
  const booking = await Booking.create(req.body);
  await User.findByIdAndUpdate(req.body.user,{"booking":booking._id});
  res.status(201).json({ success: true, data: booking });
};

// desc     Create new booking
// route    POST /api/v1/mybookings
// access   Private
exports.createBookingforcurrentuser = async (req,res,next) => {
  try{
    //see token
  let token;
  if (req.headers.authorization &&req.headers.authorization.startsWith('Bearer')){
      token=req.headers.authorization.split(' ')[1];
  }

  //Make sure token exists
  if (!token || token=='null'){
      return res.status(401).json({success:false,message:'Login to create your booking'});
  }
  const decoded = jwt.verify(token,process.env.JWT_SECRET);
  const tokenUser=await User.findById(decoded.id); //booking owner
  if(!req.body.dentist || !req.body.bookingDate){
    return res.status(400).json({success:false,msg:"Invalid request body"});
  }
  //check if there is the dentist provided
  const dentist=Dentist.findById(req.body.dentist);
  if (!dentist){
    return res.status(400).json({success:false,msg:"Unknown dentist provided."});
  }
  //If user have already booked
  if (tokenUser.booking){
    return res.status(400).json({success:false,msg:"User had already booked."});
  }
  const newRequestBody = { user: decoded.id,...req.body};
  const booking = await Booking.create(newRequestBody);
  await User.findByIdAndUpdate(decoded.id,{"booking":booking._id});
  res.status(201).json({ success: true, data: booking });
  }catch(err){
    console.log(err);
    res.status(400).json({success:false});
  }
}

// desc     Update booking
// route    PUT /api/v1/bookings/:id
// access   Private
exports.updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(400).json({ success: false, msg: "Booking not found" });
    }
    //see token
  let token;
  if (req.headers.authorization &&req.headers.authorization.startsWith('Bearer')){
      token=req.headers.authorization.split(' ')[1];
  }

  //Make sure token exists
  if (!token || token=='null'){
      return res.status(401).json({success:false,message:'Not authorize to access this route. Please login'});
  }
  //verify if the user is creating their own booking
  const decoded = jwt.verify(token,process.env.JWT_SECRET);
  const  tokenuser=await User.findById(decoded.id);
  //Not updating for their own and not an admin
  if (tokenuser.role=="user" && decoded.id!==booking.user.id.toString()){
    return res.status(400).json({success:false,msg:"User token does not match the request. You can only edit your own booking."});
  }
  //if req.body.user is provided, it must be the same.
  if (req.body.user!==undefined && req.body.user!==booking.user.toString()){
    return res.status(400).json({success:false,msg:"Invalid update. Cannot change booking owner."});
  }
  //update dentist and booking date
  await Booking.findByIdAndUpdate(req.params.id,req.body);
  res.status(200).json({ success: true, data: booking });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
};

// desc     Update booking
// route    PUT /api/v1/bookings/mybooking
// access   Private
exports.updateMyBooking =async (req,res,next)=>{
  try {
    //see token
  let token;
  if (req.headers.authorization &&req.headers.authorization.startsWith('Bearer')){
      token=req.headers.authorization.split(' ')[1];
  }
  //Make sure token exists
  if (!token || token=='null'){
      return res.status(401).json({success:false,message:'Not authorize to access this route. Please login'});
  }
  //verify if the user is creating their own booking
  const decoded = jwt.verify(token,process.env.JWT_SECRET);
  const tokenuser=await User.findById(decoded.id); //booking owner
  if (!tokenuser.booking || tokenuser.booking===null){
    return res.status(400).json({success:false,message:"User haven't booked one."})
  }
  //update dentist and booking date
  await Booking.findByIdAndUpdate(tokenuser.booking,req.body);
  res.status(200).json({ success: true, data: tokenuser});
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
}

// desc     Delete booking
// route    GET /api/v1/bookings/:id
// access   Private
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(400).json({ succes: false, msg: "Booking not found" });
    }

    //Check if the user is the owner of this booking
    //see token
  let token;
  if (req.headers.authorization &&req.headers.authorization.startsWith('Bearer')){
      token=req.headers.authorization.split(' ')[1];
  }

  //Make sure token exists
  if (!token || token=='null'){
      return res.status(401).json({success:false,message:'Not authorize to access this route. Please login'});
  }
  //verify if the user is creating their own booking
  const decoded = jwt.verify(token,process.env.JWT_SECRET);
  const  tokenuser=User.findById(decoded.id);
  //User is not an admin and is deleting other's booking.
  if (tokenuser.role==="user" &&booking.user.toString()!==decoded.id){
    return res.status(400).json({success:false,msg:"You can only delete your own booking."});
  }
  //Make user's booking null
  await User.findByIdAndUpdate(booking.user.toString(),{"booking":null});
  await booking.deleteOne();
  res.status(200).json({ succes: true, data: {} });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
};

// desc     Delete booking
// route    GET /api/v1/bookings/mybooking
// access   Private
exports.deletemyBooking = async (req, res, next) => {
  try {
    //see token
  let token;
  if (req.headers.authorization &&req.headers.authorization.startsWith('Bearer')){
      token=req.headers.authorization.split(' ')[1];
  }

  //Make sure token exists
  if (!token || token=='null'){
      return res.status(401).json({success:false,message:'Not authorize to access this route. Please login'});
  }
  //verify if the user is creating their own booking
  const decoded = jwt.verify(token,process.env.JWT_SECRET);
  const  tokenuser=await User.findById(decoded.id);
  if (!tokenuser.booking || tokenuser.booking=="null"){
    return res.status(400).json({success:false,msg:"User has no booking"});
  }
  //delete booking
  await Booking.findByIdAndDelete(tokenuser.booking);
  //Make user's booking null
  await User.findByIdAndUpdate(decoded.id,{"booking":null});
  res.status(200).json({ succes: true, data: {} });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
};
