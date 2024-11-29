const { Router } = require("express");
const { validarJWT } = require("../middleware/validar-jwt");
const { esAdminRole, tieneRole } = require("../middleware/validar-roles");
const { buscarAs400 } = require("../controllers/agendamiento");

const router = Router();

router.get("/:dlnuor", [validarJWT, tieneRole], buscarAs400);
//router.get("/", [validarJWT, tieneRole], buscarordene);

module.exports = router;
