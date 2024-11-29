const { Router } = require("express");
const { consultaubicacion, postubicacion, ubicacionUpdate, ubicacionDelete } = require("../controllers/ubicacion");
const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");
const { consultaTipogrupo, postTipogrupo, TipogrupoDelete, TipogrupoUpdate } = require("../controllers/tipogrupo");


const router = Router();

router.get("/", [validarJWT, tieneRole],consultaTipogrupo);
router.post("/", [validarJWT, tieneRole],postTipogrupo);
router.put("/:id",[validarJWT, tieneRole], TipogrupoUpdate);
router.delete("/:id", [validarJWT, tieneRole],TipogrupoDelete);

module.exports = router;