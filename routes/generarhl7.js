const { Router } = require("express");
const { check } = require("express-validator");

const { existenumeroorden } = require("../helpers/db-validators");
const { validarCampos } = require("../middleware/validar-campos");
const { validarJWT } = require("../middleware/validar-jwt");
const { esAdminRole, tieneRole } = require("../middleware/validar-roles");
const { generarhl7 } = require("../controllers/generarhl7");
const router = Router();

router.put("/:id", generarhl7, [validarJWT, tieneRole]);

module.exports = router;
