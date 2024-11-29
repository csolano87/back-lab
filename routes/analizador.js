const { Router } = require("express");

const { validarJWT } = require("../middleware/validar-jwt");
const { esAdminRole, tieneRole } = require("../middleware/validar-roles");
const { getAnalizador, createAnalizador, updateAnalizador, deleteAnalizador, getBYIdAnalizador, GetfiltroAnalizador } = require("../controllers/analizador");

const router = Router();
router.get("/:id", validarJWT, tieneRole,getBYIdAnalizador );
router.get("/", [validarJWT, tieneRole],getAnalizador);
router.get("/busquedaanalizador/:busquedaanalizador", [validarJWT, tieneRole],GetfiltroAnalizador);
router.post("/", [validarJWT, tieneRole],createAnalizador);
router.put("/:id", [validarJWT, tieneRole], updateAnalizador);
router.delete("/:id", [validarJWT, tieneRole],deleteAnalizador);

module.exports = router;
