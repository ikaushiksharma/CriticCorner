const express = require("express");
const { create } = require("../controllers/actor");
const { uploadImage } = require("../middlewares/multer");
const router = express.Router();

router.post("/create",uploadImage.single('avatar'),create);

module.exports = router;
