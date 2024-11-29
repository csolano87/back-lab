const { Router } = require("express");
const { deleteMedico, updateMedico, postMedico, getIdMedico, getMedico } = require("../controllers/medico");
const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");

const router = Router();

router.get("/",[validarJWT,tieneRole],getMedico);
router.get("/:id",[validarJWT,tieneRole],getIdMedico)
router.post("/",[validarJWT,tieneRole],postMedico);
router.put("/:id",[validarJWT,tieneRole],updateMedico);
router.delete("/:id",[validarJWT,tieneRole],deleteMedico)

module.exports=router;
