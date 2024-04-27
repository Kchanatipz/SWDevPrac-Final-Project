const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const { json } = require("express");
const path = require("path");
const nodemailer = require("nodemailer");

const HTML = `<!DOCTYPE html>
<html lang="en">
  <head><style>
      body {font-family: sans-serif;display: flex;justify-content: center;align-items: center;min-height: 100vh;background-color: #f0f0f0;}
      .container {background-color: #fff;padding: 30px;border-radius: 5px;box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);width: 400px;} h1 {text-align: center;margin-bottom: 20px;} .button-container {text-align: center;}
      button {background-color: #3498db;color: #fff;padding: 10px 20px;border: none;border-radius: 10px;cursor: pointer;transition: background-color 0.2s ease-in-out;}button:hover {background-color: #0c6cac;}</style></head>
  <body><div class="container"><h1>Click this button to reset your password</h1><form action="http://localhost:5200/api/v1/user/resetpassword/ui/`;

// desc     Send reset password to user via email
// route    POST /api/v1/user/resetpassword/:id
// access   Public
exports.resetUserPassword = async (req, res, next) => {
  const receiver = await User.findById(req.params.id);
  console.log(receiver.email);
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SENDER,
      pass: process.env.APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: {
      name: "Chanatip X Phumsiri",
      address: process.env.SENDER,
    },
    to: receiver.email,
    subject: "Reset your password",
    text: "Click this button below that will lead you to another website.",
    html: `${HTML}${req.params.id}"><div class="button-container"><button type="submit">Reset Password</button></div></form></div></body></html>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent!");
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error sending email: ", error);
    res.status(400).json({ success: false });
  }
};

// desc     Get Reset password UI
// route    GET /api/v1/user/resetpassword/ui/:id
// access   Public
exports.getResetPasswordUI = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { root: path.join(__dirname) };

    res.status(200).sendFile("index.html", options);
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
};

// desc     Reset user's password from getResetPasswordUI
//          (id & newpassword in body)
// route    PUT /api/v1/user/resetpassword/confirm
// access   Public
exports.confirmResetpassword = async (req, res, next) => {
  try {
    const id = req.body.id;
    const newPassword = req.body.password;

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    const user = await User.findByIdAndUpdate(
      id,
      {
        password: hashPassword,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res
      .status(200)
      .json({ success: true, msg: "Password updated", data: user });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, msg: "Can't reset password" });
  }
};
