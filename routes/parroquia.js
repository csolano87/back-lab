const { Router } = require("express");

const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");
const { createParroquia, updateParroquia, deleteParroquia, getParroquia } = require("../controllers/parroquia");

const router = Router();

router.get("/", [validarJWT, tieneRole],getParroquia);
router.post("/", [validarJWT, tieneRole],createParroquia);
router.put("/:id", [validarJWT, tieneRole],updateParroquia);
router.delete("/:id", [validarJWT, tieneRole],deleteParroquia);

module.exports = router;