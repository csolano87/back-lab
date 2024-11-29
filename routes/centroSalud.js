const { Router } = require("express");
const { centroSalud } = require("../controllers/centroSalud");

const { cacheInit } = require("../middleware/cache");

const { validarJWT } = require("../middleware/validar-jwt");
const { esAdminRole, tieneRole } = require("../middleware/validar-roles");

const router = Router();

router.get("/", [validarJWT, cacheInit, tieneRole], centroSalud);

module.exports = router;
