const { Router } = require("express");

const { validarJWT } = require("../middleware/validar-jwt");

const { tieneRole } = require("../middleware/validar-roles");
const { updateDespachopedido } = require("../controllers/despachopedido");

const router = Router();

router.get("/", [validarJWT, tieneRole]);
router.get("/:id", [validarJWT, tieneRole]);

router.post("/", [validarJWT, tieneRole]);
router.put("/:id", [validarJWT, tieneRole],updateDespachopedido);
router.delete("/:id", [validarJWT, tieneRole]);

module.exports = router;