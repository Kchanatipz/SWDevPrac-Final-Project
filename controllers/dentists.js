const { json } = require("express");
const Dentist = require("../models/Dentist");

// desc     Get all dentists
// route    GET /api/v1/dentists
// access   Public
exports.getAllDentists = async (req, res, next) => {
  try {
    const dentists = await Dentist.find();

    res
      .status(200)
      .json({ succes: true, count: dentists.length, data: dentists });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, msg: "Can't find dentists" });
  }
};

// desc     Get single dentist
// route    GET /api/v1/dentists/:id
// access   Public
exports.getDentist = async (req, res, next) => {
  try {
    const dentist = await Dentist.findById(req.params.id);

    if (!dentist) {
      return res.status(400).json({ success: false, msg: "Dentist not found" });
    }

    res.status(200).json({ success: true, data: dentist });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, msg: "Error" });
  }
};

// desc     Create new dentist
// route    POST /api/v1/dentists
// access   Private
exports.createDentist = async (req, res, next) => {
  const dentist = await Dentist.create(req.body);

  res
    .status(201)
    .json({
      success: true,
      data: dentist,
      msg: `Dentist ${req.body.name} created.`,
    });
};

// desc     Update dentist
// route    PUT /api/v1/dentists/:id
// access   Private
exports.updateDentist = async (req, res, next) => {
  try {
    const dentist = await Dentist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!dentist) {
      return res.status(400).json({ success: false, msg: "Dentist not found" });
    }

    res.status(200).json({ success: true, data: dentist });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
};

// desc     Delete dentist
// route    GET /api/v1/dentists/:id
// access   Private
exports.deleteDentist = async (req, res, next) => {
  try {
    const dentist = await Dentist.findByIdAndDelete(req.params.id);

    if (!dentist) {
      return res.status(400).json({ succes: false, msg: "Dentist not found" });
    }

    res.status(200).json({ succes: true, data: {} });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
};
