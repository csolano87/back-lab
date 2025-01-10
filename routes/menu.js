const { Router } = require("express");
const {
	getMenu,
	postMenu,
	getByIdMenu,
	putMenu,
	DeleteMenu,
} = require("../controllers/menu");
const { esAdminRole, tieneRole } = require("../middleware/validar-roles");
const { validarJWT } = require("../middleware/validar-jwt");

const router = Router();

router.get("/",[validarJWT,tieneRole], getMenu);
router.post("/",[validarJWT,esAdminRole], postMenu);
router.get("/:id",[validarJWT,esAdminRole], getByIdMenu);
router.put("/:id",[validarJWT,esAdminRole], putMenu);


router.delete("/:id",[validarJWT,esAdminRole], DeleteMenu);


module.exports = router;
