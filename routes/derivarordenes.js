const { Router } = require("express");
const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");
const {
	getDerivarOrden,
	postDerivarOrden,
	putDerivarOrden,
	getBYIdDerivarOrden,
} = require("../controllers/derivarordenes");
const { route } = require("./auth");

const router = Router();

router.get("/", [validarJWT, tieneRole], getDerivarOrden);
router.get("/:id",[validarJWT,tieneRole],getBYIdDerivarOrden)
router.post("/", [validarJWT, tieneRole], postDerivarOrden);
router.put("/", [validarJWT, tieneRole], putDerivarOrden);

module.exports = router;
