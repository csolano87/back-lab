const { Router } = require("express");
const { tipoContratoDelete, tipoContratoUpdate, posttipoContrato, consultatipoContrato } = require("../controllers/tipocontrato");
const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");


const router = Router();

router.get("/", [validarJWT, tieneRole],consultatipoContrato);
router.post("/", [validarJWT, tieneRole],posttipoContrato);
router.put("/:id",[validarJWT, tieneRole], tipoContratoUpdate);
router.delete("/:id", [validarJWT, tieneRole],tipoContratoDelete);

module.exports = router;