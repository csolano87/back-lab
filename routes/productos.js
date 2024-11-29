const { Router } = require("express");

const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");
const {
	getProductos,
	getByProductos,
	createProductos,
	deleteProductos,
	postProductos,
	getByIdProductos,
	updateProductos,
} = require("../controllers/productos");
const multer = require("multer");

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
router.get("/", [validarJWT, tieneRole], getProductos);
router.get("/producto/:id", [validarJWT, tieneRole], getByIdProductos);
router.get("/:q", [validarJWT, tieneRole], getByProductos);
router.post(
	"/",
	upload.single("file"),
	validarJWT,
	tieneRole,

	createProductos
);
router.post(
	"/producto",

	validarJWT,
	tieneRole,

	postProductos
);
/* router.post(
	"/productos/producto/",
	
	validarJWT,
	tieneRole,

	postProductos
); */

router.put(
	"/:id",

	validarJWT,
	tieneRole,

	updateProductos
);
router.delete("/:id", [validarJWT, tieneRole], deleteProductos);

module.exports = router;
