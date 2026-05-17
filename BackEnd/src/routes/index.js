const express = require("express");

const authRoutes = require("../modules/auth/auth.routes");
const animaisRoutes = require("../modules/animais/animais.routes");
const ongsRoutes = require("../modules/ongs/ongs.routes");
const uploadsRoutes = require("../modules/uploads/uploads.routes");
const usuariosRoutes = require("../modules/usuarios/usuarios.routes");

const router = express.Router();

router.get("/health", (req, res) => {
  return res.json({
    message: "API funcionando!",
  });
});

router.use("/auth", authRoutes);
router.use("/usuarios", usuariosRoutes);
router.use("/ongs", ongsRoutes);
router.use("/animais", animaisRoutes);
router.use("/uploads", uploadsRoutes);

module.exports = router;
