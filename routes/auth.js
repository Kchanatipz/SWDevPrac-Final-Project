const express = require("express");
const {
  register,
  login,
  logout,
  resetPassword,
} = require("../controllers/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.put("/resetpassword", resetPassword);

module.exports = router;
