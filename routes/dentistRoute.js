const express = require("express");
const {
  getAllDentists,
  getDentist,
  createDentist,
  updateDentist,
  deleteDentist,
} = require("../controllers/dentistsController");

const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const app = express();

router
  .route("/")
  .get(getAllDentists)
  .post(protect, authorize("admin"), createDentist);
router
  .route("/:id")
  .get(getDentist)
  .put(protect, authorize("admin"), updateDentist)
  .delete(protect, authorize("admin"), deleteDentist);

module.exports = router;
