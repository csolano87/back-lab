const { Router } = require("express");

const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");
const { createcanton, getcanton, deletecanton, updatecanton } = require("../controllers/canton");

const router = Router();

router.get("/", [validarJWT, tieneRole],getcanton);
router.post("/", [validarJWT, tieneRole],createcanton);
router.put("/:id", [validarJWT, tieneRole],updatecanton);
router.delete("/:id", [validarJWT, tieneRole],deletecanton);

module.exports = router;