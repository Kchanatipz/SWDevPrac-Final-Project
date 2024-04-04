const express = require("express");

const router = express.Router();
const app = express();

// router.get("/", (req, res) => {
//   res.status(200).json({ success: true, msg: "Hi from server.js" });
// });

router.get("/", (req, res) => {
  res.status(200).json({ success: true, msg: "Show all boookings" });
});

router.get("/:id", (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Show boooking ${req.params.id}` });
});

router.post("/", (req, res) => {
  res.status(200).json({ success: true, msg: `Create new boooking` });
});

router.put("/:id", (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Update booking ${req.params.id}` });
});

router.delete("/:id", (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete booking ${req.params.id}` });
});

module.exports = router;
