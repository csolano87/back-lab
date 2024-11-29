const { Router } = require("express");
const { generarId } = require("../controllers/id");
const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");

//const { check } = require('express-validator');
//validator = require('validator');

const router = Router();

router.put(
  "/",
  [validarJWT, tieneRole],
  generarId,
);

module.exports = router;
