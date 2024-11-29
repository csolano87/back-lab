const { Router } = require("express");

const { consultaroles, createroles } = require("../controllers/roles");
const { validarJWT } = require("../middleware/validar-jwt");
const { esAdminRole } = require("../middleware/validar-roles");

const router = Router();

router.get("/", [validarJWT, esAdminRole], consultaroles);
router.post("/", [validarJWT, esAdminRole], createroles);
/* 

router.put('/:id',usuariosUpdate );

router.post('/',usuariosPost );

router.delete('/:id',usuariosDelete );
 */

module.exports = router;
