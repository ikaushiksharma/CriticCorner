const express = require("express");
const { create } = require("../controllers/user");
const { userValidtor, validate } = require("../middlewares/validator.js");

const router = express.Router();

router.post("/create", userValidtor, validate, create);

module.exports = router;
