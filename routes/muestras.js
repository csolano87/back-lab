


const { DataTypes, Sequelize, Model } = require("sequelize");

const { Router } = require("express");

const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");
const { consultaMuestra, postMuestra, MuestraUpdate, MuestraDelete, GetIDMuestra } = require("../controllers/muestras");


const router = Router();

router.get("/", [validarJWT, tieneRole],consultaMuestra);
router.get("/:id", [validarJWT, tieneRole],GetIDMuestra);
router.post("/", [validarJWT, tieneRole],postMuestra);
router.put("/:id",[validarJWT, tieneRole], MuestraUpdate);
router.delete("/:id", [validarJWT, tieneRole],MuestraDelete);

module.exports = router;