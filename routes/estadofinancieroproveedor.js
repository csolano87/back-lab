const { Router } = require("express");
const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole, esAdminRole } = require("../middleware/validar-roles");
const { estadoproveedorDelete, estadoproveedorUpdate, postestadoproveedor, Getfiltroestadoproveedor, GetIDestadoproveedor, consultaestadoproveedor } = require("../controllers/estadofinancieroproveedor");


const router = Router();


router.get("/", [validarJWT, tieneRole],consultaestadoproveedor);
router.get("/:id", [validarJWT, tieneRole],GetIDestadoproveedor );
router.get(
    "/busquedaestadofinancieroproveedor/:busquedaestadofinancieroproveedor",
    [validarJWT, tieneRole],
    Getfiltroestadoproveedor,
  );
router.post("/", [validarJWT, tieneRole],postestadoproveedor);
router.put("/:id",[validarJWT, tieneRole], estadoproveedorUpdate);
router.delete("/:id", [validarJWT, tieneRole],estadoproveedorDelete);

module.exports = router;