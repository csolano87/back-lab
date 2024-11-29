const { repsonse, response } = require("express");
const Cabecera = require("../models/cabecera");

const existenumeroorden = async (req, res = response, next) => {
  const { NUMEROORDEN } = req.params;
  const numeroorden = await Cabecera.findOne({
    where: { NUMEROORDEN: NUMEROORDEN },
  });

  // console.log('valoidar orden',numeroorden)
  if (!numeroorden) {
    return res
      .status(404)
      .json({ msg: `El numero de orden: ${NUMEROORDEN} no existe ` });
  }
  next();
};
module.exports = { existenumeroorden };
