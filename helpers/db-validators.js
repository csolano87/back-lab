const Cabecera = require("../models/cabecera");
const Role = require("../models/role");

const rolValido = async (rol = "") => {
  //console.log(rol);
  /* cambio de rol x id */
  const existeRol = await Role.findOne({ where: { id: rol } });
  //console.log(existeRol);
  if (!existeRol) {
    throw new Error(`El rol ${rol} no esta registrado en la BD`);
  }
};

module.exports = { rolValido };
