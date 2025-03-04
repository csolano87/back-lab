const { Router } = require("express");

const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");
const { consultaTiposervicio, postTiposervicio, TiposervicioUpdate, TiposervicioDelete, GetIDTiposervicio } = require("../controllers/tiposervicio");


const router = Router();

router.get("/", [validarJWT, tieneRole],consultaTiposervicio);
router.get("/:id", [validarJWT, tieneRole],GetIDTiposervicio);
router.post("/", [validarJWT, tieneRole],postTiposervicio);
router.put("/:id",[validarJWT, tieneRole],TiposervicioUpdate );
router.delete("/:id", [validarJWT, tieneRole], TiposervicioDelete);

module.exports = router;