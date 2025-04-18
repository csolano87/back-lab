const { Router } = require("express");

const {
  erGet,
  tokenInfinity,
  pacienteInfinity,
  getEnvioMail,
} = require("../controllers/infinity");

const { existenumeroorden } = require("../middleware/validar-orden");

const { validarJWT } = require("../middleware/validar-jwt");
const { esAdminRole, tieneRole } = require("../middleware/validar-roles");
const router = Router();

//router.get('/', tokenInfinity);

router.get("/:NUMEROORDEN", [validarJWT, tieneRole], erGet);
router.post("/", [validarJWT, tieneRole], getEnvioMail);

//router.post('/:cedula', pacienteInfinity);

module.exports = router;
