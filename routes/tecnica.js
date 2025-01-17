


const { DataTypes, Sequelize, Model } = require("sequelize");

const { Router } = require("express");

const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");
const { consultaTecnica, postTecnica, TecnicaUpdate, TecnicaDelete, GetIDTecnica } = require("../controllers/tecnica");


const router = Router();

router.get("/", [validarJWT, tieneRole],consultaTecnica);
router.get("/:id", [validarJWT, tieneRole],GetIDTecnica);
router.post("/", [validarJWT, tieneRole],postTecnica);
router.put("/:id",[validarJWT, tieneRole], TecnicaUpdate);
router.delete("/:id", [validarJWT, tieneRole],TecnicaDelete);

module.exports = router;