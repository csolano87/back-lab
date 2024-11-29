const { Router } = require("express");
const multer = require("multer");
const {
	postStockPruebas,
	getStockPruebas,
    deletePrueba,
} = require("../controllers/stock-pruebas");
const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");

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
router.post(
	"/",
	upload.single("file"),
	validarJWT,
	tieneRole,
	postStockPruebas
);
router.get("/", [validarJWT, tieneRole], getStockPruebas);
router.delete("/:id", [validarJWT, tieneRole], deletePrueba);

module.exports = router;
