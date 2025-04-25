const { Router } = require("express");

const { orden } = require("../controllers/orden");
//const { cacheInit } = require("../middleware/cache");

const { validarJWT } = require("../middleware/validar-jwt");
const { esAdminRole, tieneRole } = require("../middleware/validar-roles");

const router = Router();

router.get("/", [validarJWT, tieneRole], orden);

module.exports = router;
