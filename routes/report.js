const { Router } = require("express");
const { getregistro } = require("../controllers/report");
const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");

const router = Router();

router.get("/", [validarJWT, tieneRole], getregistro);

module.exports = router;
