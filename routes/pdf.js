const { Router } = require("express");

const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");
const { getpdf, getIngresOrdenPdf } = require("../controllers/pdf");

const router = Router();

router.get("/:id", [validarJWT, tieneRole],getpdf);

router.get("/generarpdf/:id",getIngresOrdenPdf)

module.exports = router;
