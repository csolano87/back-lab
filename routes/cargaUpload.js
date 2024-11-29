const { cargaUpload } = require("../controllers/cargaUpload");
const { Router } = require("express");
const multer = require("multer");

const router= Router();

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"uploads/");
    },
    filename:function(req,file,cb){
        cb(null,file.originalname);
    },
})

const upload = multer({ storage: storage });

router.post("/",upload.single("file"), cargaUpload);


module.exports=router;
