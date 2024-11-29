const { Router } = require("express");
const { deletePaciente, updatePaciente, postPaciente, getIdPaciente, getPaciente } = require("../controllers/paciente");
const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");

const router = Router();

router.get("/",[validarJWT,tieneRole],getPaciente);
router.get("/:id",[validarJWT,tieneRole],getIdPaciente)
router.post("/",[validarJWT,tieneRole],postPaciente);
router.put("/:id",[validarJWT,tieneRole],updatePaciente);
router.delete("/:id",[validarJWT,tieneRole],deletePaciente);

module.exports=router;
