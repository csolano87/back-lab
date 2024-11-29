const { Router } = require("express");

const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");
const { consultaTipoatencion, postTipoatencion, TipoatencionUpdate, TipoatencionDelete } = require("../controllers/tipoatencion");


const router = Router();

router.get("/", [validarJWT, tieneRole],consultaTipoatencion);
router.post("/", [validarJWT, tieneRole],postTipoatencion);
router.put("/:id",[validarJWT, tieneRole], TipoatencionUpdate);
router.delete("/:id", [validarJWT, tieneRole],TipoatencionDelete);

module.exports = router;