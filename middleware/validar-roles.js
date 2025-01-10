const { repsonse, response } = require("express");

const Roles = require("../models/role");
const esAdminRole = (req, res = repsonse, next) => {
  if (!req.usuario) {
     console.log(req.usuario)
    return res
      .status(500)
      .json({
        msg: "Se quiere verificar el role sin validar el token primero",
      });
  }

  const { roleId, doctor } = req.usuario;
  console.log(roleId)


  if (roleId != "1" ) {
    return res
      .status(401)
      .json({ msg: `${doctor} no es administrador-no puede hacer esto` });
  }
  next();
};

const tieneRole = async (req, res = repsonse, next) => {
  const { roleId } = req.usuario;

  if (!req.usuario) {
    //console.log(req.usuario)
    return res
      .status(500)
      .json({
        msg: "Se quiere verificar el role sin validar el token primero",
      });
  }
  // console.log(' Este es mi rol  ',rol)

 // const roles = await Roles.findOne({ where: { rol: rol } });
 const roles = await Roles.findByPk(roleId);
  console.log(roles)
  if (!roles) {
    return res
      .status(401)
      .json({ msg: `El servicio requiere uno de estos roles ${roles}` });
  }
  next();
};

module.exports = { esAdminRole, tieneRole };
