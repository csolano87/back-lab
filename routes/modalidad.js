const { Router } = require("express");
const {
	modalidadDelete,
	modalidadUpdate,
	postmodalidad,
	consultamodalidad,
} = require("../controllers/modalidad");
const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");

const router = Router();

router.get("/",[validarJWT, tieneRole], consultamodalidad);
router.post("/", [validarJWT, tieneRole],postmodalidad);
router.put("/:id",[validarJWT, tieneRole], modalidadUpdate);
router.delete("/:id", [validarJWT, tieneRole],modalidadDelete);

module.exports = router;