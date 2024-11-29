const { Request, Response } = require("express");
const Provincia = require("../models/provincias");

const getProvincia = async (req, res) => {
  const provincia = await Provincia.findAll();

  res.json({ ok: true, provincia: provincia });
};

const postProvincia = async (req, res) => {
  const { descripcion } = req.body;

  console.log(req.body);
  const provincias = new Provincia({ descripcion });
  const provincia = await Provincia.findOne({
    where: {
      descripcion: provincias.descripcion,
    },
  });

  if (provincia) {
    return res.status(400).json({
      msg: "Esta provincia  ya existe",
    });
  }

  await provincias.save();
  res.status(201).json({ msg: "la provincia a sido registrado con exito" });
};

module.exports = { getProvincia, postProvincia };
