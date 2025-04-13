const { Router } = require("express");
const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");
const {
	getDerivarOrden,
	postDerivarOrden,
	putDerivarOrden,
} = require("../controllers/derivarordenes");

const router = Router();

router.get("/", [validarJWT, tieneRole], getDerivarOrden);
router.post("/", [validarJWT, tieneRole], postDerivarOrden);
router.put("/", [validarJWT, tieneRole], putDerivarOrden);

module.exports = router;
