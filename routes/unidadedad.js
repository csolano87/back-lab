const { Router } = require("express");

const { tieneRole } = require("../middleware/validar-roles");
const { validarJWT } = require("../middleware/validar-jwt");
const { consultaunidadedad, postunidadedad, unidadedadUpdate, unidadedadDelete } = require("../controllers/unidadedad");

const router = Router();

router.get("/", [validarJWT, tieneRole],consultaunidadedad);
router.post("/", [validarJWT, tieneRole],postunidadedad);
router.put("/:id",[validarJWT, tieneRole], unidadedadUpdate);
router.delete("/:id",[validarJWT, tieneRole], unidadedadDelete);

module.exports = router;