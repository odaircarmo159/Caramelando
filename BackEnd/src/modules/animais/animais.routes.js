const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");
const controller = require("./animais.controller");
const {
  criarAnimalSchema,
  atualizarAnimalSchema,
} = require("./animais.shema");

const router = express.Router();

router.get("/stats/platform", controller.getPlatformStats);
router.get("/", controller.listAnimais);
router.get("/me/ong", authMiddleware, controller.getCurrentOngAnimals);
router.get("/:id", controller.getAnimalById);
router.post("/", authMiddleware, validate(criarAnimalSchema), controller.createAnimal);
router.patch(
  "/:id",
  authMiddleware,
  validate(atualizarAnimalSchema),
  controller.updateAnimal
);
router.delete("/:id", authMiddleware, controller.deleteAnimal);

module.exports = router;
