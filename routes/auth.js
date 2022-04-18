const express = require("express");
const { registerController, loginController } = require("../controllers/auth");
const { validatorRegister, validatorLogin } = require("../validators/auth");
const router = express.Router();

/**
 * Crea un item
 */
router.post("/register", validatorRegister, registerController);

router.post("/login", validatorLogin, loginController);

module.exports = router;
