const User = require("../models/UserModel");
const bcrypt = require("bcryptjs"); //invite encrypt to do something(hash pw) in this code
const jwt = require("jsonwebtoken"); //call jsonwebtoken extension

//@desc     Register user
//@route    POST /api/v1/auth/register
//@access   Public
exports.register = async (req, res, next) => {
  try {
    const { name, telephoneNumber, email, password, role } = req.body;
    //check existence of email
    const existedUser = await User.find({ email: email });
    if (existedUser.length > 0) {
      return res
        .status(400)
        .json({ success: false, msg: "This email is already registered" });
    }
    //Create user
    const user = await User.create({
      name,
      telephoneNumber,
      email,
      password,
      role,
    });
    //Create token
    console.log("Creating User");
    // const token=user.getSignedJwtToken();
    // res.status(200).json({success:true,token});
    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false });
    console.log(err.stack);
  }
};

//@desc     Login User
//@route    POST /api/v1/auth/login
//@access   Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //validate email or password
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide an email and password" });
    }
    //check for user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, msg: "This email has never been registered." });
    }
    //check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, msg: "Password does not match" });
    }
    //create token
    //  const token=user.getSignedJwtToken();
    //  res.status(200).json({success:true,token});
    sendTokenResponse(user, 200, res);
  } catch (err) {
    return res.status(401).json({
      success: false,
      msg: "Cannot convert email or password to string",
    });
  }
};

//Get Token from model, Create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //Create Token
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ), //set expired date of this cookie in ms
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    // //add for frontend
    // _id:user._id,
    // name:user.name,
    // email:user.email,
    // //end for frontend
    token,
  });
};

//@desc     Log user out /clear cookie
//@route    GET /api/v1/auth/logout
//@access   Private
exports.logout = async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    data: {},
  });
};

exports.resetPassword = async (req, res, next) => {
  const userID = req.body.userID;
  const password = req.body.password;
  const salt = await bcrypt.genSalt(10);
  const newpassword = await bcrypt.hash(password, salt);
  try {
    if (!(await User.findById(userID))) {
      return res
        .status(400)
        .json({ success: false, msg: "User ID does not exist" });
    }
    const user = await User.findByIdAndUpdate(userID, {
      password: newpassword,
    });
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ success: false, from: "controllers" });
  }
};
