const express = require("express");
const {
  create,
  update,
  remove,
  search,
  getLatestActors,
  getSingleActor,
} = require("../controllers/actor");
const { isAuth, isAdmin } = require("../middlewares/auth");
const { uploadImage } = require("../middlewares/multer");
const { actorInfoValidator, validate } = require("../middlewares/validator");
const router = express.Router();

router.post(
  "/create",
  isAuth,
  isAdmin,
  uploadImage.single("avatar"),
  actorInfoValidator,
  validate,
  create,
);
router.post(
  "/update/:actorId",
  uploadImage.single("avatar"),
  isAuth,
  isAdmin,
  actorInfoValidator,
  validate,
  update,
);
router.delete("/:actorId", isAuth, isAdmin, remove);
router.get("/search", isAuth, isAdmin, search);
router.get("/latest-uploads", isAuth, isAdmin, getLatestActors);
router.get("/single/:actorId", getSingleActor);
module.exports = router;
