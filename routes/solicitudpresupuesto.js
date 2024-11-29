const {Router}=require("express");
const { consultaSolicitudPresupuesto, postSolicitudPresupuesto, SolicitudPresupuestoUpdate, SolicitudPresupuestoDelete } = require("../controllers/solicitudpresupuesto");
const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");



const router =Router();

router.get("/",[validarJWT, tieneRole],consultaSolicitudPresupuesto);
router.post("/",[validarJWT, tieneRole],postSolicitudPresupuesto);
router.put("/:id",[validarJWT, tieneRole],SolicitudPresupuestoUpdate);
router.delete("/:id",[validarJWT, tieneRole],SolicitudPresupuestoDelete)


module.exports=router;