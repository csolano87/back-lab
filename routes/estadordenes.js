const { Router } = require("express");

const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");

const multer = require("multer");
const { createresult } = require("../controllers/result");
const {getResultsOrders, getOrders, getResultsSex,getOrdenesInfinity, getPacientes} = require("../controllers/estadordenes");

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

router.get("/", [validarJWT, tieneRole],getResultsOrders);
router.get("/estadomensual", [validarJWT, tieneRole],getOrders);//getResultsSex
router.get("/estado/resultsOrders", [validarJWT, tieneRole],getResultsSex);//getResultsSex
router.get("/ordenesInfinity", [validarJWT, tieneRole],getOrdenesInfinity);

router.post("/ordenes",upload.single('file'), [validarJWT, tieneRole],getPacientes);

module.exports = router;

