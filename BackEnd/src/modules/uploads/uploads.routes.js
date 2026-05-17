const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");
const controller = require("./uploads.controller");

const router = express.Router();

router.post(
  "/animal-image",
  authMiddleware,
  express.raw({ type: "image/*", limit: "10mb" }),
  controller.uploadAnimalImage
);

module.exports = router;
