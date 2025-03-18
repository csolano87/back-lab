const { Router } = require("express");

const { validarJWT } = require("../middleware/validar-jwt");
const { postNotificar, getNotificar } = require("../controllers/notificarDespacho");
const { tieneRole } = require("../middleware/validar-roles");

const router = Router();

router.get("/", [validarJWT, tieneRole], getNotificar);
router.get("/:id", [validarJWT, tieneRole]);

router.post("/", [validarJWT, tieneRole],postNotificar);
router.put("/:id", [validarJWT, tieneRole]);
router.delete("/:id", [validarJWT, tieneRole]);

module.exports = router;
