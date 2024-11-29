const { Router } = require("express");
const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");
const { DiagnosticoDelete, postDiagnostico, DiagnosticoUpdate, consultaDiagnostico } = require("../controllers/diagnostico");


const router = Router();

router.get("/", [validarJWT, tieneRole],consultaDiagnostico);
router.post("/", [validarJWT, tieneRole],postDiagnostico);
router.put("/:id",[validarJWT, tieneRole], DiagnosticoUpdate);
router.delete("/:id", [validarJWT, tieneRole],DiagnosticoDelete);

module.exports = router;