const { Router } = require("express");


const { validarJWT } = require("../middleware/validar-jwt");
const { esAdminRole, tieneRole } = require("../middleware/validar-roles");
const { createcliente, getcliente } = require("../controllers/cliente");


const router = Router();

router.get("/", [validarJWT, tieneRole], getcliente);

router.post("/", [validarJWT, tieneRole], createcliente);
/* 

router.put('/:id',usuariosUpdate );

router.post('/',usuariosPost );

router.delete('/:id',usuariosDelete );
 */

module.exports = router;