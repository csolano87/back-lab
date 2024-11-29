

const { Router } = require("express");

const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");
const { getequipocomplementario, createequipocomplementario, deleteequipocomplementario, updateequipocomplementario, getBYIdequipocomplememnatrio, GetfiltroEquipCom } = require("../controllers/equipocomplementario");

const router = Router();

router.get("/", [validarJWT, tieneRole],getequipocomplementario);
router.get("/:id", [validarJWT, tieneRole],getBYIdequipocomplememnatrio );
router.get(
    "/busquedaequipcom/:busquedaequipcom",
    [validarJWT, tieneRole],
    GetfiltroEquipCom,
  );
router.post("/", [validarJWT, tieneRole],createequipocomplementario);
router.put("/:id", [validarJWT, tieneRole],updateequipocomplementario);
router.delete("/:id", [validarJWT, tieneRole],deleteequipocomplementario);

module.exports = router;