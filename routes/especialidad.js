const { Router } = require("express");

const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");
const { EspecialidadDelete, postEspecialidad, consultaEspecialidad, EspecialidadUpdate } = require("../controllers/especialidad");



const router = Router();

router.get("/", [validarJWT, tieneRole],consultaEspecialidad);
router.post("/", [validarJWT, tieneRole],postEspecialidad);
router.put("/:id",[validarJWT, tieneRole], EspecialidadUpdate);
router.delete("/:id", [validarJWT, tieneRole],EspecialidadDelete);


module.exports = router;