const { Router } = require("express");
const { getMenuRoles, postMenuRoles } = require("../controllers/menuRoles");
const { validarJWT } = require("../middleware/validar-jwt");
const { esAdminRole } = require("../middleware/validar-roles");





const router = Router();

router.get("/",[validarJWT, esAdminRole],getMenuRoles);
router.post("/",[validarJWT,esAdminRole],postMenuRoles);






module.exports=router;