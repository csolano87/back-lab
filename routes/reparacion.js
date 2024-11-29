const { Router } = require("express");
const {
	reparacionDelete,
	reparacionUpdate,
	postreparacion,
	consultareparacion,
} = require("../controllers/reparacion");
const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");

const router = Router();

router.get("/", [validarJWT, tieneRole],consultareparacion);
router.post("/", [validarJWT, tieneRole],postreparacion);
router.put("/:id", [validarJWT, tieneRole],reparacionUpdate);
router.delete("/:id", [validarJWT, tieneRole],reparacionDelete);

module.exports = router;