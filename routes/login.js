const { Router } = require("express");

const { login } = require("../controllers/login");

const router = Router();

router.post("/", login);
/* 

router.put('/:id',usuariosUpdate );

router.post('/',usuariosPost );

router.delete('/:id',usuariosDelete );
 */

module.exports = router;
