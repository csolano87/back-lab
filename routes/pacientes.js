const { Router } = require("express");

const { pacientes } = require("../controllers/pacientes");
const { cacheInit } = require("../middleware/cache");
const { validarJWT } = require("../middleware/validar-jwt");
const { esAdminRole, tieneRole } = require("../middleware/validar-roles");

const router = Router();

router.get("/", [validarJWT, cacheInit, tieneRole], pacientes);

/* 
router.put('/:id',usuariosUpdate );

router.post('/',usuariosPost );

router.delete('/:id',usuariosDelete );
 */

module.exports = router;
