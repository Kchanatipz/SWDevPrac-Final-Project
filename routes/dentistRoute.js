const express = require("express");
const {
  getAllDentists,
  getDentist,
  createDentist,
  updateDentist,
  deleteDentist,
} = require("../controllers/dentistsController");

const router = express.Router();
const app = express();

router.route("/").get(getAllDentists).post(createDentist);
router.route("/:id").get(getDentist).put(updateDentist).delete(deleteDentist);

module.exports = router;
