const { Router } = require("express");
const { consultaubicacion, postubicacion, ubicacionUpdate, ubicacionDelete, GetIDubicacion, GetfiltroUbicacion } = require("../controllers/ubicacion");
const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole, esAdminRole } = require("../middleware/validar-roles");


const router = Router();

router.get("/", [validarJWT, tieneRole],consultaubicacion);
router.get("/:id", [validarJWT, tieneRole],GetIDubicacion );
router.get(
    "/busquedaubicacion/:busquedaubicacion",
    [validarJWT, tieneRole],
    GetfiltroUbicacion,
  );
router.post("/", [validarJWT, tieneRole],postubicacion);
router.put("/:id",[validarJWT, tieneRole], ubicacionUpdate);
router.delete("/:id", [validarJWT, tieneRole],ubicacionDelete);

module.exports = router;