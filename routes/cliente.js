const { Router } = require("express");


const { validarJWT } = require("../middleware/validar-jwt");
const { esAdminRole } = require("../middleware/validar-roles");
const { createcliente, getcliente } = require("../controllers/cliente");


const router = Router();

router.get("/", [validarJWT, esAdminRole], getcliente);
router.post("/", [validarJWT, esAdminRole], createcliente);
/* 

router.put('/:id',usuariosUpdate );

router.post('/',usuariosPost );

router.delete('/:id',usuariosDelete );
 */

module.exports = router;