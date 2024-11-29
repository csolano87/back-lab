


const { Router } = require("express");

const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");
const postTransferencia = require("../controllers/transferencia");

const router = Router();

router.get("/", [validarJWT, tieneRole],);
router.post("/", [validarJWT, tieneRole],postTransferencia);
/* router.put("/:id", [validarJWT, tieneRole],contratoUpdate);
router.delete("/:id", [validarJWT, tieneRole],contratoDelete); */

module.exports = router;

