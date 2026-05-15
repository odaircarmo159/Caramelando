const express = require("express");
const validate = require("../../middlewares/validate.middleware");
const controller = require("./ongs.controller");
const { criarOngSchema } = require("./ongs.schema");

const router = express.Router();

router.post(
  "/",
  validate(criarOngSchema),
  controller.createOng
);

module.exports = router;
