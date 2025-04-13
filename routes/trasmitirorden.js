const { Router } = require("express");
const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");
const { postTramitirOrden } = require("../controllers/trasmitirorden");



const router = Router();

router.post("/",[validarJWT,tieneRole],postTramitirOrden)




module.exports=router;
