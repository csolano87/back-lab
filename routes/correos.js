const { Router } = require("express");


const { validarJWT } = require("../middleware/validar-jwt");
const { esAdminRole } = require("../middleware/validar-roles");
const { consultacorreo, createcorreo, correoUpdate, correoDelete } = require("../controllers/correos");

const router = Router();

router.get("/", [validarJWT, esAdminRole], consultacorreo);
router.post("/", [validarJWT, esAdminRole],createcorreo );

router.put('/:id', [validarJWT, esAdminRole], correoUpdate);



router.delete('/:id',  [validarJWT, esAdminRole],correoDelete);


module.exports = router;
