const { Router } = require("express");
const { createImpresora, getImpresora } = require("../controllers/impresora");
const { validarJWT } = require("../middleware/validar-jwt");
const { esAdminRole } = require("../middleware/validar-roles");
const { validarCampos } = require("../middleware/validar-campos");
const { check } = require("express-validator");

const router = Router();

router.get("/", validarJWT, esAdminRole, getImpresora);
router.post(
  "/",
  validarJWT,
  esAdminRole,
  [
    check("NOMBRE", "El nombre de la impresora  es obligatorio")
      .not()
      .isEmpty(),
    validarCampos,
  ],
  createImpresora,
);

module.exports = router;
