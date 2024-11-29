const { Router } = require("express");

const { tieneRole } = require("../middleware/validar-roles");
const { validarJWT } = require("../middleware/validar-jwt");
const { consultarangoreferencia, postrangoreferencia, rangoreferenciaUpdate, rangoreferenciaDelete, GetIDrangoreferencia } = require("../controllers/rangoreferencia");

const router = Router();

router.get("/", [validarJWT, tieneRole],consultarangoreferencia);
router.get("/:id", [validarJWT, tieneRole],GetIDrangoreferencia);
router.post("/", [validarJWT, tieneRole],postrangoreferencia);
router.put("/:id",[validarJWT, tieneRole], rangoreferenciaUpdate);
router.delete("/:id",[validarJWT, tieneRole],rangoreferenciaDelete );

module.exports = router;