const { Router } = require("express");
const { check } = require("express-validator");

const { existenumeroorden } = require("../helpers/db-validators");
const { validarCampos } = require("../middleware/validar-campos");
const { validarJWT } = require("../middleware/validar-jwt");
const { esAdminRole, tieneRole } = require("../middleware/validar-roles");
const {
  ordenexternaGet,
  ordenexternaUpdate,
  ordenexternaPost,
  ordenexternaDelete,
  ordenexternaGetTodos,
  ordenesGetfiltroExterna,
  ordenexternaById,
} = require("../controllers/ordenexterna");
const router = Router();

router.get("/", [validarJWT, tieneRole], ordenexternaGet);

router.get("/todos", [validarJWT, tieneRole], ordenexternaGetTodos);


router.get("/:id", [validarJWT, tieneRole], ordenexternaById);

router.get("/filtros/externa", [validarJWT, tieneRole], ordenesGetfiltroExterna);

router.put("/:id",[validarJWT, tieneRole], ordenexternaUpdate);

router.post("/", [validarJWT, tieneRole], ordenexternaPost);

router.delete("/:id", [validarJWT, tieneRole], ordenexternaDelete);

//router.patch('/', usuariosPatch );

module.exports = router;
