const { Router } = require("express");

const { validarJWT } = require("../middleware/validar-jwt");
const { esAdminRole, tieneRole } = require("../middleware/validar-roles");
const { GetAccesoriocotizacion, postAccesoriocotizacion, UpdateAccesoriocotizacion, DeleteAccesoriocotizacion } = require("../controllers/accesoriocotizacion");

const router = Router();
router.get("/:id", validarJWT, esAdminRole, );
router.get("/", [validarJWT, tieneRole], GetAccesoriocotizacion);
router.post("/", [validarJWT, esAdminRole],postAccesoriocotizacion);
router.put("/:id", [validarJWT, esAdminRole], UpdateAccesoriocotizacion);
router.delete("/:id", [validarJWT, esAdminRole],DeleteAccesoriocotizacion);

module.exports = router;
