const { Router } = require("express");

const { validarJWT } = require("../middleware/validar-jwt");
const { esAdminRole, tieneRole } = require("../middleware/validar-roles");
const { getEquipos, createEquipos, updateEquipos, deleteEquipos, GetIdEquipos, GetfiltroEquipo } = require("../controllers/equipos");

const router = Router();
router.get("/:id", validarJWT, tieneRole, GetIdEquipos);
router.get("/", [validarJWT, tieneRole],getEquipos);
router.get(
    "/busquedaequipo/busquedas",
    [validarJWT, tieneRole],
    GetfiltroEquipo,
  );
router.post("/", [validarJWT, tieneRole],createEquipos);
router.put("/:id", [validarJWT, tieneRole], updateEquipos);
router.delete("/:id", [validarJWT, tieneRole],deleteEquipos);

module.exports = router;
