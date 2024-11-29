const { Router } = require("express");

const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");
const {
	getPedido,
	createPedido,
	getFiltroPedido,
	deletePedido,
	getAllPedido,
	updatePedido,
} = require("../controllers/pedidoImportacion");

const router = Router();
router.get("/",[validarJWT, tieneRole], getPedido);
router.get("/filtros",[validarJWT, tieneRole],getAllPedido)
router.get("/:id", [validarJWT, tieneRole],getFiltroPedido);
router.put("/:id", [validarJWT, tieneRole],updatePedido);
router.post("/",[validarJWT, tieneRole],createPedido);
router.delete("/:id", [validarJWT, tieneRole], deletePedido);



module.exports = router;
