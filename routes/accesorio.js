const { Router } = require("express");
const {
	contratoDelete,
	contratoUpdate,
	postcontrato,
	consultacontrato,
} = require("../controllers/contrato");
const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");

const router = Router();

router.get("/", [validarJWT, tieneRole],consultacontrato);
router.post("/", [validarJWT, tieneRole],postcontrato);
router.put("/:id", [validarJWT, tieneRole],contratoUpdate);
router.delete("/:id", [validarJWT, tieneRole],contratoDelete);

module.exports = router;