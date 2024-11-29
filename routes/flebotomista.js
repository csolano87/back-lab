const { Router } = require("express");
const { flebotomista } = require("../controllers/flebotomista");

const { cacheInit } = require("../middleware/cache");

const { validarJWT } = require("../middleware/validar-jwt");
const { esAdminRole, tieneRole } = require("../middleware/validar-roles");

const router = Router();

router.get("/", [validarJWT, cacheInit, tieneRole], flebotomista);

module.exports = router;
