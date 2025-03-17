const { Router } = require("express");

const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");
const { createStock, updateStock, 
    
    deleteStock, getAllStock, getFiltroStock, getStock, getBusquedaStock, 
    getStockPdf,
    cargarexcelStock,
    listadogetStock,
    getByIdcargarexcelStock,
    getByIdStock} = require("../controllers/stock");

const { check } = require("express-validator");
const { validarCampos } = require("../middleware/validar-campos");

const router = Router();
router.get("/",[validarJWT, tieneRole], getStock);
router.get("/cargaInterna/",[validarJWT, tieneRole], listadogetStock);
router.get("/filtros",[validarJWT, tieneRole],getAllStock)
router.get("/buscar/:termino",[validarJWT, tieneRole],getBusquedaStock);
router.get("/busqueda/:id",[validarJWT,tieneRole],getByIdStock);
 router.get("/:id", [validarJWT, tieneRole],getFiltroStock); 
router.put("/:id", [validarJWT, tieneRole,
    check("bodegaId","La bodega es obligatoria").not().isEmpty(),
    check("proveedorId","El proveedor  es obligatoria").not().isEmpty(),
    validarCampos
],
    
    updateStock);
router.post("/",[validarJWT, tieneRole],createStock);
router.post("/cargaInterna/",[validarJWT, tieneRole],cargarexcelStock);
router.get("/cargaInterna/:id",[validarJWT, tieneRole],getByIdcargarexcelStock);
router.delete("/:id", [validarJWT, tieneRole], deleteStock);
router.get("/reporte/pdf",getStockPdf)



module.exports = router;
