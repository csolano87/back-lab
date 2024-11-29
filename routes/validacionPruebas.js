const { Router } = require("express");
const { validarJWT } = require("../middleware/validar-jwt");
const { updateExamen } = require("../controllers/validacionPruebas");

const router = Router();

router.put("/:id", validarJWT, updateExamen);

module.exports = router;
