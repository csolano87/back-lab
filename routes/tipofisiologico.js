const { Router } = require("express");

const { tieneRole } = require("../middleware/validar-roles");
const { validarJWT } = require("../middleware/validar-jwt");
const { consultatipofisiologico, posttipofisiologico, tipofisiologicoUpdate, tipofisiologicoDelete } = require("../controllers/tipofisiologico");

const router = Router();

router.get("/", [validarJWT, tieneRole],consultatipofisiologico);
router.post("/", [validarJWT, tieneRole],posttipofisiologico);
router.put("/:id",[validarJWT, tieneRole], tipofisiologicoUpdate);
router.delete("/:id",[validarJWT, tieneRole], tipofisiologicoDelete);

module.exports = router;