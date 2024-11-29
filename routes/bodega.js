const { Router } = require("express");

const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole, esAdminRole } = require("../middleware/validar-roles");
const { consultabodega, GetIDbodega, postbodega, bodegaUpdate, bodegaDelete } = require("../controllers/bodega");

const router = Router();

router.get("/", [validarJWT, tieneRole],consultabodega );
router.get("/:id", [validarJWT, tieneRole],GetIDbodega );
/* router.get(
	"/busquedaestadocliente/:busquedaestadocliente",
	[validarJWT, tieneRole],
	
); */
router.post("/", [validarJWT, tieneRole], postbodega);
router.put("/:id", [validarJWT, tieneRole], bodegaUpdate);
router.delete("/:id", [validarJWT, tieneRole],bodegaDelete );

module.exports = router;
