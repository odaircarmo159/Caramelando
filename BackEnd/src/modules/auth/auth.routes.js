const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");
const controller = require("./auth.controller");
const { loginSchema } = require("./auth.schema");

const router = express.Router();

router.post("/login", validate(loginSchema), controller.login);
router.get("/me", authMiddleware, controller.getCurrentSession);

module.exports = router;
