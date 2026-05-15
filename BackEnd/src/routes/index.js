const express = require("express");

const ongsRoutes = require("../modules/ongs/ongs.routes");

const router = express.Router();

router.get("/health", (req, res) => {
  return res.json({
    message: "API funcionando!",
  });
});

router.use("/ongs", ongsRoutes);

module.exports = router;
