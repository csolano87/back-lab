const { Router } = require("express");
const { mail, estadic } = require("../controllers/mail");
const multer = require("multer");
const { esAdminRole } = require("../middleware/validar-roles");
const { validarJWT } = require("../middleware/validar-jwt");

const router = Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });


router.post("/upload", upload.single('file'), [validarJWT,esAdminRole],mail );

router.get("/", estadic);

module.exports = router;
