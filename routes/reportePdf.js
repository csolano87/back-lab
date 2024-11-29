const { Router } = require("express");

const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");
const { Reportepdf } = require("../controllers/reportePdf");


const router = Router();

router.get("/:id",Reportepdf,[validarJWT,tieneRole] );



module.exports = router;