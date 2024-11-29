const { Request, Response } = require("express");
const Impresora = require("../models/impresora");

const getImpresora = async (req, res) => {
  const impresora = await Impresora.findAll();

  res.json({ ok: true, impresora });
};

const createImpresora = async (req, res) => {
  const { NOMBRE } = req.body;

  const impresora = new Impresora({ NOMBRE });
  const imp = await Impresora.findOne({
    where: {
      NOMBRE: NOMBRE,
    },
  });

  if (imp) {
    return res.status(400).json({
      msg: "Este nombre de la impresora  ya existe",
    });
  }

  await impresora.save();
  res.status(201).json({ msg: "la impresora ha  registrado con exito" });
};

const updateImpresora = async (req, res) => {
  res.send("update guardada con exito..");
};

const deleteImpresora = async (req, res) => {
  res.status(200).json({
    msg: "El usuario a sido desactivado con exito...",
  });
};

module.exports = {
  getImpresora,
  createImpresora,
  updateImpresora,
  deleteImpresora,
};
