const { check } = require("express-validator");

const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");

const { validarCampos } = require("../middleware/validar-campos");
const { Router } = require("express");
const { ordenPost } = require("../controllers/ordenManual");

const router = Router();
router.post(
  "/",
  validarJWT,
  tieneRole,
  [
    check("IDENTIFICADOR", "El IDENTIFICADOR es obligatorio").not().isEmpty(),
    check("NOMBRES", "El NOMBRES es obligatorio").not().isEmpty(),
    check("APELLIDO", "El APELLIDO es obligatorio").not().isEmpty(),
    check("FECHANACIMIENTO", "El FECHANACIMIENTO es obligatorio")
      .not()
      .isEmpty(),
    check("TELEFONO", "El TELEFONO es obligatorio").not().isEmpty(),
    check("SEXO", "El SEXO es obligatorio").not().isEmpty(),
    check("HIS", "El HIS es obligatorio").not().isEmpty(),

    check("CODDOCTOR", "El DOCTOR es obligatorio").not().isEmpty(),
    check("CODTIPOORDEN", "El TIPOORDEN es obligatorio").not().isEmpty(),
    check("PRIORIDAD", "El PRIORIDAD es obligatorio").not().isEmpty(),
    check("OPERADOR", "El OPERADOR es obligatorio").not().isEmpty(),
    check("CODFLEBOTOMISTA", "El FLEBOTOMISTA es obligatorio").not().isEmpty(),
    check("CODIMPRESORA", "El IMPRESORA es obligatorio").not().isEmpty(),
    /*   check('FLEBOTOMISTA', 'El FLEBOTOMISTA es obligatorio').not().isEmpty(), */
    check("pruebas", "El CODEXAMEN es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  ordenPost,
);

module.exports = router;
