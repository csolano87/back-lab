const { Router } = require("express");
const {
	consultaEstadocliente,
	postEstadocliente,
	EstadoclienteUpdate,
	EstadoclienteDelete,
	GetIDEstadocliente,
	GetfiltroEstadocliente,
} = require("../controllers/estadofinancierocliente");
const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole, esAdminRole } = require("../middleware/validar-roles");

const router = Router();

router.get("/", [validarJWT, tieneRole], consultaEstadocliente);
router.get("/:id", [validarJWT, tieneRole], GetIDEstadocliente);
router.get(
	"/busquedaestadocliente/:busquedaestadocliente",
	[validarJWT, tieneRole],
	GetfiltroEstadocliente
);
router.post("/", [validarJWT, tieneRole], postEstadocliente);
router.put("/:id", [validarJWT, tieneRole], EstadoclienteUpdate);
router.delete("/:id", [validarJWT, tieneRole], EstadoclienteDelete);

module.exports = router;
