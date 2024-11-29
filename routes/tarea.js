const { Router } = require("express");
const { check } = require("express-validator");

const { existenumeroorden } = require("../helpers/db-validators");
const { validarCampos } = require("../middleware/validar-campos");
const { validarJWT } = require("../middleware/validar-jwt");
const { esAdminRole, tieneRole } = require("../middleware/validar-roles");

const {
  ordensaisGet,
  ordensaisUpdate,
  ordensaisPost,
  ordensaisDelete,
  ordensaisGetID,
} = require("../controllers/ordensais");
const { ordenT } = require("../controllers/tarea");
const router = Router();

router.get("/", [validarJWT, tieneRole],ordenT);

//router.patch('/', usuariosPatch );

module.exports = router;
