const { Router } = require("express");
const {
	RequerimientoEquipoDelete,
	RequerimientoEquipoUpdate,
	postRequerimientoEquipo,
	consultaRequerimientoEquipo,
} = require("../controllers/requerimientoequipo");
const { validarJWT } = require("../middleware/validar-jwt");
const { esAdminRole } = require("../middleware/validar-roles");

const router = Router();

router.get("/",[validarJWT, esAdminRole], consultaRequerimientoEquipo);
router.post("/", [validarJWT, esAdminRole],postRequerimientoEquipo);
router.put("/:id", [validarJWT, esAdminRole],RequerimientoEquipoUpdate);
router.delete("/:id", [validarJWT, esAdminRole],RequerimientoEquipoDelete);

module.exports = router;
