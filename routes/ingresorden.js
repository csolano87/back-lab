const { Router } = require("express");
const { getIngresorden, getIdIngresorden, postIngresorden, updateIngresorden, deleteIngresorden, validarIngresorden } = require("../controllers/ingresorden");
const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");

const router = Router();

router.get("/",[validarJWT,tieneRole],getIngresorden);
router.get("/:id",[validarJWT,tieneRole],getIdIngresorden)
router.post("/",[validarJWT,tieneRole],postIngresorden);
router.put("/:id",[validarJWT,tieneRole],updateIngresorden);
router.put("/validar/:id",[validarJWT,tieneRole],validarIngresorden);
router.delete("/:id",[validarJWT,tieneRole],deleteIngresorden);

module.exports=router;