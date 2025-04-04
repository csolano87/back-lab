const { Router } = require("express");

const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");

const multer = require("multer");
const { createresult } = require("../controllers/result");
const {getResultsOrders, getOrders, getResultsSex} = require("../controllers/estadordenes");



const router = Router();

 router.get("/", [validarJWT, tieneRole],getResultsOrders);
 router.get("/estadomensual", [validarJWT, tieneRole],getOrders);//getResultsSex
 router.get("/estado/resultsOrders", [validarJWT, tieneRole],getResultsSex);//getResultsSex
/*router.get("/producto/:id", [validarJWT, tieneRole],getByIdProductos);
router.get("/:q", [validarJWT, tieneRole], getByProductos); */

/* router.put(	"/:id",	validarJWT,	tieneRole,	updateProductos);
router.delete("/:id", [validarJWT, tieneRole], deleteProductos); */

module.exports = router;