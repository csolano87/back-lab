const { Router } = require("express");
const { getqc } = require("../controllers/qc");
const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ dest: "downloads/" });

const router = Router();

router.post("/upload",[validarJWT, tieneRole], upload.single("file"), getqc);

module.exports = router;
