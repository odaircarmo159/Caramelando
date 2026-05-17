const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");
const controller = require("./ongs.controller");
const { criarOngSchema, atualizarOngSchema } = require("./ongs.schema");

const router = express.Router();

router.post("/", validate(criarOngSchema), controller.createOng);
router.get("/me", authMiddleware, controller.getCurrentOng);
router.patch(
  "/me",
  authMiddleware,
  validate(atualizarOngSchema),
  controller.updateCurrentOng
);
router.get("/:id", controller.getOngById);

module.exports = router;
