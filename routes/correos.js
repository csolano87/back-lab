const { Router } = require("express");


const { validarJWT } = require("../middleware/validar-jwt");
const { esAdminRole, tieneRole } = require("../middleware/validar-roles");
const { consultacorreo, createcorreo, correoUpdate, correoDelete } = require("../controllers/correos");

const router = Router();

router.get("/", [validarJWT, tieneRole], consultacorreo);
router.post("/", [validarJWT, tieneRole],createcorreo );

router.put('/:id', [validarJWT, tieneRole], correoUpdate);





router.delete('/:id',  [validarJWT, tieneRole],correoDelete);


module.exports = router;
