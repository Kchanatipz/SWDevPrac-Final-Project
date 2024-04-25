const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); //invite encrypt to do something(hash pw) in this code
const jwt = require("jsonwebtoken"); //call jsonwebtoken extension
const Booking = require("./BookingModel");

const UserSchema = new mongoose.Schema({
  //user compose of these fields
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  telephoneNumber: {
    type: String,
    required: [true, "Please enter telephone number"],
    minlength: 9, //in case not a mobile phone
    maxlength: 10,
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please add a valid email",
    ],
    unique: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false,
  },
  booking: {
    type: mongoose.Schema.ObjectId,
    ref: Booking,
    default: null,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
//encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//sign jwt and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
