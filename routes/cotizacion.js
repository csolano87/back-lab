const { Router } = require("express");
const validator = require("ecuador-validator");
const { validarJWT } = require("../middleware/validar-jwt");
const { esAdminRole, tieneRole } = require("../middleware/validar-roles");

const {
	DeleteCotizacion,
	UpdateCotizacion,
	postCotizacion,
	consultaCotizacion,
	ReporteCotizacion,
} = require("../controllers/cotizacion");
const { check } = require("express-validator");
const { isEmpty, max } = require("lodash");
const { validarCampos } = require("../middleware/validar-campos");
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
router.get("/:id", validarJWT, esAdminRole);
router.get("/", [validarJWT, tieneRole], consultaCotizacion);
router.post(
	"/",upload.single("file"),
	validarJWT,
	esAdminRole,
	/* [
		check("RAZONSOCIAL", "La razon social es obligatorio").not().isEmpty(),
		validarCampos,
	],
	[check("RUC", "El ruc ingresado no es validado").not().isLength({max:12}), validarCampos],
	[check("CORREO", "El correo ingresado no es un correo valido").isEmail(), validarCampos],
	[
		check("MODALIDAD", "la modalidad es obligatorio").not().isEmpty(),
		validarCampos,
	],
	[
		check("ESTADISTICA", "La estadictica es obligatorio").not().isEmpty(),
		validarCampos,
	],
	[
		check("EQUIPO_ID", "El equipo  es obligatorio").not().isEmpty(),
		validarCampos,
	], */

	postCotizacion
);
router.get("/reporte/:reporte",ReporteCotizacion)
router.put("/:id", [validarJWT, esAdminRole], UpdateCotizacion);
router.delete("/:id", [validarJWT, esAdminRole], DeleteCotizacion);

module.exports = router;
