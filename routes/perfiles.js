const { Router } = require("express");
const { getPerfiles, createPerfiles, updatePerfiles, deletePerfiles, getIdperfiles } = require("../controllers/perfiles");
const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");

const router = Router();

router.get("/", [validarJWT, tieneRole],getPerfiles);
router.get("/:id",[validarJWT, tieneRole],getIdperfiles);
router.post("/",[validarJWT, tieneRole],createPerfiles);
router.put("/:id",[validarJWT, tieneRole], updatePerfiles);
router.delete("/:id",[validarJWT, tieneRole], deletePerfiles);
//router.get("/");

module.exports = router;
