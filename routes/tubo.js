const { Router } = require("express");
const { check } = require("express-validator");
const {
  gettubos,
  postTubos,
  gettubo,
  updateTubo,
} = require("../controllers/tubo");
const { validarCampos } = require("../middleware/validar-campos");

const { validarJWT } = require("../middleware/validar-jwt");
const { esAdminRole, tieneRole } = require("../middleware/validar-roles");

const router = Router();

router.post(
  "/",
  [
    validarJWT,
    tieneRole,
    check("numeroorden", "el numero de orden es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  postTubos,
);

router.get("/", [validarJWT, tieneRole], gettubos);
router.get("/todo", [validarJWT, tieneRole], gettubo);
router.put("/", [validarJWT, tieneRole], updateTubo);

module.exports = router;
