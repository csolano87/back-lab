const { repsonse, response } = require("express");

const Roles = require("../models/role");
const esAdminRole = (req, res = repsonse, next) => {
  if (!req.usuario) {
    // console.log(req.usuario)
    return res
      .status(500)
      .json({
        msg: "Se quiere verificar el role sin validar el token primero",
      });
  }

  const { rol, doctor } = req.usuario;
  //console.log(rol)


  if (rol != "ADMIN" && rol !='TICS') {
    return res
      .status(401)
      .json({ msg: `${doctor} no es administrador-no puede hacer esto` });
  }
  next();
};

const tieneRole = async (req, res = repsonse, next) => {
  const { rol } = req.usuario;

  if (!req.usuario) {
    //console.log(req.usuario)
    return res
      .status(500)
      .json({
        msg: "Se quiere verificar el role sin validar el token primero",
      });
  }
  // console.log(' Este es mi rol  ',rol)

  const roles = await Roles.findOne({ where: { rol: rol } });
  // console.log(roles)
  if (!roles) {
    return res
      .status(401)
      .json({ msg: `El servicio requiere uno de estos roles ${roles}` });
  }
  next();
};

module.exports = { esAdminRole, tieneRole };
