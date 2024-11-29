const { Router } = require("express");

const { tieneRole } = require("../middleware/validar-roles");
const { validarJWT } = require("../middleware/validar-jwt");
const { unidadDelete, unidadUpdate, postunidad, consultaunidad } = require("../controllers/unidad");

const router = Router();

router.get("/", [validarJWT, tieneRole],consultaunidad);
router.post("/", [validarJWT, tieneRole],postunidad);
router.put("/:id",[validarJWT, tieneRole], unidadUpdate);
router.delete("/:id",[validarJWT, tieneRole], unidadDelete);

module.exports = router;