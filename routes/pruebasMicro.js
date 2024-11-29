const { Router } = require("express");

const { cacheInit } = require("../middleware/cache");

const { validarJWT } = require("../middleware/validar-jwt");
const { esAdminRole, tieneRole } = require("../middleware/validar-roles");
const { pruebasMicro } = require("../controllers/pruebasMicro");

const router = Router();

router.get("/:q", [validarJWT, cacheInit, tieneRole], pruebasMicro);

module.exports = router;
