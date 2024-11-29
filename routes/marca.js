const { Router } = require("express");


const { validarJWT } = require("../middleware/validar-jwt");
const { esAdminRole, tieneRole } = require("../middleware/validar-roles");
const { createmarca, getmarca, deletemarca, getByIDmarca, updatemarca, Getfiltomarca } = require("../controllers/marca");

const router = Router();

router.get("/", [validarJWT, esAdminRole],getmarca );
router.get("/:id", [validarJWT, tieneRole], getByIDmarca);
router.get(
    "/busquedamarca/:busquedamarca",
    [validarJWT, tieneRole],
    Getfiltomarca,
  );
router.post("/", [validarJWT, esAdminRole], createmarca);
router.put('/:id', [validarJWT, tieneRole] , updatemarca);
router.delete('/:id', [validarJWT, tieneRole] ,deletemarca);
/* 

router.put('/:id',usuariosUpdate );

router.post('/',usuariosPost );

router.delete('/:id',usuariosDelete );
 */

module.exports = router;