



const { Router } = require("express");

const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");
const { getViews } = require("../controllers/dashboardviews");

const router = Router();

router.get("/", [validarJWT, tieneRole],getViews);

module.exports = router;