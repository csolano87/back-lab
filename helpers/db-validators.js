const Cabecera = require("../models/cabecera");
const Role = require("../models/role");

const rolValido = async (rol = "") => {
  console.log(rol);
  const existeRol = await Role.findOne({ where: { rol: rol } });
  console.log(existeRol);
  if (!existeRol) {
    throw new Error(`El rol ${rol} no esta registrado en la BD`);
  }
};

module.exports = { rolValido };
