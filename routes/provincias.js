/* const { Router } = require("express");

const { validarJWT } = require("../middleware/validar-jwt");
const { esAdminRole, tieneRole } = require("../middleware/validar-roles");
const { postProvincia, getProvincia } = require("../controllers/provincias");

const router = Router();

router.get("/", [validarJWT, tieneRole], getProvincia);
router.post("/", [validarJWT, tieneRole], postProvincia);

module.exports = router; */
