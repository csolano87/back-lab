const { Router } = require("express");
const { postestadoProceso, updateestadoProceso } = require("../controllers/estadoproceso");
const { tieneRole } = require("../middleware/validar-roles");
const { validarJWT } = require("../middleware/validar-jwt");


const router = Router();

//router.get("/", postestadoProceso);
router.post("/", [validarJWT, tieneRole],postestadoProceso);
router.put("/:PROCESO_ID", [validarJWT, tieneRole],updateestadoProceso);
//router.delete("/:id", estadoPrcoesoDelete);

module.exports = router;