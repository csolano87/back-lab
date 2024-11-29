const { Router } = require("express");


const { validarJWT } = require("../middleware/validar-jwt");
const { esAdminRole, tieneRole } = require("../middleware/validar-roles");
const { tipoMuestraGet, tipoMuestraPost, tipoMuestraDelete, tipoMuestraUpdate } = require("../controllers/tipomuestra");

const router = Router();

router.get("/", [validarJWT, tieneRole], tipoMuestraGet);
router.post("/", [validarJWT, tieneRole], tipoMuestraPost);
router.put("/:id", [validarJWT, tieneRole],tipoMuestraUpdate );
router.delete("/:id", [validarJWT, tieneRole], tipoMuestraDelete);

module.exports = router;
