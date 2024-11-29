const { Router } = require("express");

const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");
const { getMicro } = require("../controllers/reportMicro");

const router = Router();

router.get("/", [validarJWT, tieneRole], getMicro);

module.exports = router;
