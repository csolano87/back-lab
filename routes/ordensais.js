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
const router = Router();

router.get("/:cedula", [validarJWT, tieneRole], ordensaisGetID);

router.get("/", validarJWT, tieneRole, ordensaisGet);

router.put("/:id", validarJWT, tieneRole, ordensaisUpdate);

router.post("/", validarJWT, tieneRole, ordensaisPost);

router.delete("/:id", [validarJWT, tieneRole], ordensaisDelete);

//router.patch('/', usuariosPatch );

module.exports = router;
