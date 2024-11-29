const { Router } = require("express");
const { consultaestado, postestado, estadoUpdate, estadoDelete, GetIDestado, GetfiltroEstado } = require("../controllers/estado");
const { tieneRole } = require("../middleware/validar-roles");
const { validarJWT } = require("../middleware/validar-jwt");


const router = Router();

router.get("/", [validarJWT, tieneRole],consultaestado);
router.get("/:id", [validarJWT, tieneRole], GetIDestado);
router.get(
    "/busquedaestado/:busquedaestado",
    [validarJWT, tieneRole],
    GetfiltroEstado,
  );
router.post("/", [validarJWT, tieneRole],postestado);
router.put("/:id",[validarJWT, tieneRole], estadoUpdate);
router.delete("/:id",[validarJWT, tieneRole], estadoDelete);

module.exports = router;