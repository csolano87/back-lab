const { Router } = require("express");
const { pruebas } = require("../controllers/pruebas");
const { cacheInit } = require("../middleware/cache");

const { validarJWT } = require("../middleware/validar-jwt");
const { esAdminRole, tieneRole } = require("../middleware/validar-roles");

const router = Router();

router.get("/:q", [validarJWT, cacheInit, tieneRole], pruebas);

module.exports = router;
