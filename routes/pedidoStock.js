const { Router } = require("express");

const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");

const { getPedidoStock, getAllPedidoStock, getFiltroPedidoStock, updatePedidoStock, createPedidoStock, deletePedidoStock, getReportePdfPedidoStock, filtropedidoBodega, updateStockPedido, updateValidarCantidades, getFiltroPedidoBodega } = require("../controllers/pedidoStock");

const router = Router();
router.get("/",[validarJWT, tieneRole], getPedidoStock);
router.get("/filtros/:id",[validarJWT, tieneRole],getAllPedidoStock)
router.get("/reporte-pdf/:id",getReportePdfPedidoStock);
router.get("/bodega/bodegaStock",[validarJWT, tieneRole],getFiltroPedidoBodega)
router.get("/:id", [validarJWT, tieneRole],getFiltroPedidoStock);
router.put("/:id", [validarJWT, tieneRole],updatePedidoStock);
router.put("/validar-cantidad/:id", [validarJWT, tieneRole],updateValidarCantidades);
router.post("/",[validarJWT, tieneRole],createPedidoStock);

router.delete("/:id", [validarJWT, tieneRole], deletePedidoStock);
router.get("/bodega/bodega", [validarJWT, tieneRole], filtropedidoBodega)
//router.put("/",[validarJWT, tieneRole],updateStockPedido)



module.exports = router;
