const { Router } = require("express");

const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");
const { createStock, updateStock, 
    
    deleteStock, getAllStock, getFiltroStock, getStock, getBusquedaStock, 
    getStockPdf} = require("../controllers/stock");


const router = Router();
router.get("/",[validarJWT, tieneRole], getStock);
router.get("/filtros",[validarJWT, tieneRole],getAllStock)
router.get("/buscar/:termino",[validarJWT, tieneRole],getBusquedaStock)
 router.get("/:id", [validarJWT, tieneRole],getFiltroStock); 
router.put("/:id", [validarJWT, tieneRole],updateStock);
router.post("/",[validarJWT, tieneRole],createStock);
router.delete("/:id", [validarJWT, tieneRole], deleteStock);
router.get("/reporte/pdf",getStockPdf)



module.exports = router;
