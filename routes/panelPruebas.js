const { Router } = require("express");

const { consultaroles, createroles } = require("../controllers/roles");
const { validarJWT } = require("../middleware/validar-jwt");
const { esAdminRole, tieneRole } = require("../middleware/validar-roles");
const {
	createpanelPruebas,
	getpanelPruebas,
	deletepanelPruebas,
	getIdpruebas,
	updatepanelPruebas,
	cargaexcelPanelpruebas,
	updateFavoriteField,
} = require("../controllers/panelPruebas");
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

router.get("/", validarJWT, esAdminRole, getpanelPruebas);
router.get("/:id", validarJWT, esAdminRole, getIdpruebas);
router.post("/", validarJWT, esAdminRole, createpanelPruebas);
router.post(
	"/cargaexcel",
	upload.single("file"),
	validarJWT,
	tieneRole,
	cargaexcelPanelpruebas
);
router.put("/:id", validarJWT, esAdminRole, updatepanelPruebas);
router.put("/favorite/:id", validarJWT, esAdminRole, updateFavoriteField);

router.delete("/:id", validarJWT, esAdminRole, deletepanelPruebas);
/* 

router.put('/:id',usuariosUpdate );

router.post('/',usuariosPost );

router.delete('/:id',usuariosDelete );
 */

module.exports = router;
