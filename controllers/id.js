const { Request, Response } = require("express");
const Usuario = require("../models/usuarios");
const idAutoIncrement = require("id-auto-increment");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generarJWT");
const Cabecera = require("../models/cabecera");

const generarId = async (req, res) => {
  const numero = await Cabecera.findAll({
    attributes: ["NUMEROORDEN"],
    limit: 1,
  });

  let fe = numero[0].NUMEROORDEN.substring(9, 10);
  //console.log(fe)
  // let d = fe++
  if (fe < 9) {
    let fer = numero[0].NUMEROORDEN.substring(9);
    console.log("numerocortado", fer);
    const d = fer++;
    console.log("suma", d);
  }
};

module.exports = { generarId };
