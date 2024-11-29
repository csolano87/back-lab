const { Router } = require("express");

const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");
const { getprovincia, createprovincia, updateprovincia, deleteprovincia } = require("../controllers/provincia");

const router = Router();

router.get("/", [validarJWT, tieneRole],getprovincia);
router.post("/", [validarJWT, tieneRole],createprovincia);
router.put("/:id", [validarJWT, tieneRole],updateprovincia);
router.delete("/:id", [validarJWT, tieneRole],deleteprovincia);

module.exports = router;