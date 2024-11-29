const { Router } = require("express");

const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");

const multer = require("multer");
const { createresult } = require("../controllers/result");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/");
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});
const upload = multer({ storage: storage });
const router = Router();
/* router.get("/", [validarJWT, tieneRole],getProductos);
router.get("/producto/:id", [validarJWT, tieneRole],getByIdProductos);
router.get("/:q", [validarJWT, tieneRole], getByProductos); */
router.post("/",upload.single("file"),validarJWT,tieneRole,	createresult);
/* router.put(	"/:id",	validarJWT,	tieneRole,	updateProductos);
router.delete("/:id", [validarJWT, tieneRole], deleteProductos); */

module.exports = router;
