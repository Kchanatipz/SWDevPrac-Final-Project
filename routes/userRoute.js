const express = require("express");
const router = express.Router();

const {
  resetUserPassword,
  getResetPasswordUI,
  confirmResetpassword,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");

const app = express();

router.route("/resetpassword/confirm").put(confirmResetpassword);
router.route("/resetpassword/ui/:id").get(getResetPasswordUI);
router.route("/resetpassword/:id").put(resetUserPassword);

module.exports = router;
