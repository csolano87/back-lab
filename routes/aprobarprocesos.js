const { Router } = require("express");
const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");
const { postProcesos, updateProcesos } = require("../controllers/aprobarprocesos");



const router= Router();



router.get("/:id",[validarJWT, tieneRole],);
router.put("/:id",validarJWT,tieneRole,updateProcesos);
router.post("/",validarJWT,tieneRole,postProcesos)




module.exports=router;