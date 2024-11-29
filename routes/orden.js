const { Router } = require("express");

const { orden } = require("../controllers/orden");
const { cacheInit } = require("../middleware/cache");

const { validarJWT } = require("../middleware/validar-jwt");
const { esAdminRole, tieneRole } = require("../middleware/validar-roles");

const router = Router();

router.get("/", [validarJWT, cacheInit, tieneRole], orden);

module.exports = router;
