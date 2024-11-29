const { Router } = require("express");

const { validarJWT } = require("../middleware/validar-jwt");
const { check } = require("express-validator");
const { tieneRole, esAdminRole } = require("../middleware/validar-roles");
const { resetPassword } = require("../controllers/resetPassword");
const { validarCampos } = require("../middleware/validar-campos");

const router = Router();

router.put(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("password", "El password es obligatorio / min 8 letras").isLength({
      min: 8,
    }),

    validarCampos,
  ],
  resetPassword,
);

module.exports = router;
