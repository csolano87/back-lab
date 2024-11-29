const { Router } = require("express");
const { check } = require("express-validator");

const {
	categoriaGet,
	categoriaUpdate,
	categoriaPost,
	categoriaDelete,
	login,
	pacienteGetfiltro,
	ordenesGetID,
	ordenesGetfiltro,
} = require("../controllers/categoria");
const { existenumeroorden } = require("../helpers/db-validators");
const { validarCampos } = require("../middleware/validar-campos");
const { validarJWT } = require("../middleware/validar-jwt");
const { esAdminRole, tieneRole } = require("../middleware/validar-roles");
const router = Router();

router.get("/", [validarJWT, tieneRole], categoriaGet);
/* router.get('/:id', [validarJWT,
  esAdminRole], ordenesGetID); */
router.get("/ordenes/:id", [validarJWT, tieneRole], ordenesGetID);

router.put(
	"/:id",
	validarJWT,
	tieneRole,
	[
		check("CODTIPOORDEN", "El CODTIPOORDEN es obligatorio").not().isEmpty(),
		check("CODDOCTOR", "El CODDOCTOR es obligatorio").not().isEmpty(),
		check("NOMBRES", "El NOMBRES es obligatorio").not().isEmpty(),
		check("APELLIDO", "El APELLIDO es obligatorio").not().isEmpty(),
		check("FECHANACIMIENTO", "El FECHANACIMIENTO es obligatorio")
			.not()
			.isEmpty(),
		check("SEXO", "El SEXO es obligatorio").not().isEmpty(),
		check("DETALLE.*.ItemID", "El CODEXAMEN es obligatorio").not().isEmpty(),
		check("DETALLE.*.ESTADO", "El EXAMEN es obligatorio").not().isEmpty(),
		validarCampos,
	],
	categoriaUpdate
);
router.get("/paciente/:cedula", [validarJWT, tieneRole], pacienteGetfiltro);
router.post(
	"/",
	validarJWT,
	tieneRole,
	[
		validarJWT,
		tieneRole,
		check("CODDOCTOR", "El DOCTOR es obligatorio").not().isEmpty(),
		check("CODTIPOORDEN", "El TIPOORDEN es obligatorio").not().isEmpty(),
		check("IDENTIFICADOR", "El IDENTIFICADOR es obligatorio").not().isEmpty(),
		check("NOMBRES", "El NOMBRES es obligatorio").not().isEmpty(),
		check("APELLIDO", "El APELLIDO es obligatorio").not().isEmpty(),
		check("FECHANACIMIENTO", "El FECHANACIMIENTO es obligatorio")
			.not()
			.isEmpty(),
		check("SEXO", "El SEXO es obligatorio").not().isEmpty(),
		check("pruebas", "El CODEXAMEN es obligatorio").not().isEmpty(),
		validarCampos,
	],
	categoriaPost
);
router.get("/buscarordenes", [validarJWT, tieneRole], ordenesGetfiltro);
router.delete("/:id", [validarJWT, tieneRole], categoriaDelete);

module.exports = router;
