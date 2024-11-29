const { Router } = require("express");
const { password } = require("../controllers/password");
const { validarCampos } = require("../middleware/validar-campos");
const { validarJWT } = require("../middleware/validar-jwt");
const { check } = require("express-validator");
const { tieneRole } = require("../middleware/validar-roles");

const router = Router();

router.put(
  "/:id",
  [
    validarJWT,
    tieneRole,
    check("password", "El password es obligatorio / min 8 letras").isLength({
      min: 8,
    }),
    check(
      "newpassword",
      "El newpassword es obligatorio / min 8 letras",
    ).isLength({ min: 8 }),
    validarCampos,
  ],
  password,
);

module.exports = router;
