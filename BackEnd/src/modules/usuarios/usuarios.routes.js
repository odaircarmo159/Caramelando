const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");
const controller = require("./usuarios.controller");
const {
  criarUsuarioSchema,
  atualizarUsuarioSchema,
} = require("./usuarios.shema");

const router = express.Router();

router.post("/register", validate(criarUsuarioSchema), controller.createUsuario);
router.get("/me", authMiddleware, controller.getCurrentUsuario);
router.patch(
  "/me",
  authMiddleware,
  validate(atualizarUsuarioSchema),
  controller.updateCurrentUsuario
);

module.exports = router;
