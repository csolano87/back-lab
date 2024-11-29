const { Request, Response } = require("express");
const { Op } = require("sequelize");
const fs = require("fs");
const moment = require("moment");
const bcryptjs = require("bcryptjs");

//const { json } =require ('sequelize/types');
const Cabecera = require("../models/cabecera");
const Detalle = require("../models/detalle");

const path = require("path");
const { where } = require("sequelize");
const Tubo = require("../models/tubo");
const Envase = require("../models/tipoTubo");

const postTubos = async (req, res) => {
  const { numeroorden, estado, comentario } = req.body;

  const user = req.usuario;
  const orden = numeroorden.split("-");

  const tuboId = await Envase.findOne({
    where: { codigo: orden[1] },
  });

  const cabeceraId = await Cabecera.findOne({
    where: { NUMEROORDEN: orden[0] },
  });

  if (cabeceraId == null) {
    return res.status(400).json({
      msg: "Orden no ingresada en INFINITY",
    });
  }
  console.log("resssssssssssssssssssssss", cabeceraId);

  const tubo = new Tubo({
    numeroorden: orden[0],
    tipoTubo: orden[1],
    usuarioIngresa: user.usuario,
    pacientesId: cabeceraId.id,
    comentario: comentario,
    estado: estado,
  });
  console.log(tubo);
  await tubo.save();
  res.status(201).json({
    msg: "El tubo a sido registrado con exito",
  });
};

const gettubo = async (req, res) => {
  moment.locale("es");
  const hoy = moment();
  const fecha = hoy.format().slice(2, 10).replaceAll("-", "");
  const fechaT = hoy.format("L").split("/");
  const fechHoy = fechaT[2] + "-" + fechaT[1] + "-" + fechaT[0];
  const totalDiario = await Tubo.count({
    where: { fechaIngreso: fechHoy, estado: 1 },
  });
  const rechazo = await Tubo.count({
    where: { fechaIngreso: fechHoy, estado: 2 },
  });

  res.status(200).json({ ok: true, totalDia: totalDiario, rechazo: rechazo });
};
const updateTubo = async (req, res) => {
  moment.locale("es");
  const hoy = moment();
  const fecha = hoy.format().slice(2, 10).replaceAll("-", "");
  const fechaT = hoy.format("L").split("/");
  const fechaToma = fechaT[2] + "-" + fechaT[1] + "-" + fechaT[0];
  const horaToma = hoy.format("LTS");
  const user = req.usuario;
  const { estado, comentario, comentarioUpdate, numeroorden } = req.body;
  const orden = numeroorden.split("-");

  console.log(orden);

  if (estado == "1") {
    await Tubo.update(
      {
        comentarioUpdate: comentarioUpdate,
        fechaUpdate: fechaToma,
        horaUpdate: horaToma,
        usuarioUpdate: user.usuario,

        estado,
        estado,
      },
      { where: { numeroorden: orden[0], tipoTubo: orden[1] } },
    );
    res
      .status(200)
      .json({ ok: true, msg: "El tubo a sido actualizado con exito" });
  } else {
    await Tubo.update(
      {
        comentario: comentario,
        fechaRechaza: fechaToma,
        horaRechaza: horaToma,
        usuarioRechaza: user.usuario,

        estado,
        estado,
      },
      { where: { numeroorden: orden[0], tipoTubo: orden[1] } },
    );
    res
      .status(200)
      .json({ ok: true, msg: "El tubo a sido actualizado con exito" });
  }
};
const gettubos = async (req, res) => {
  /*   moment.locale('es');
    const hoy = moment();
    const fecha = hoy.format().slice(2, 10).replaceAll('-', '');
    const fechaT = hoy.format('L').split('/'); 
    const fechHoy=fechaT[2]+'-'+fechaT[1]+'-'+fechaT[0]
    console.log(`*************TUBO**********`,fechHoy
    ) */
  moment.locale("es");
  const hoy = moment();
  const fecha = hoy.format().slice(2, 10).replaceAll("-", "");
  const fechaT = hoy.format("L").split("/");
  const fechHoy = fechaT[2] + "-" + fechaT[1] + "-" + fechaT[0];
  const TotalTubos = await Tubo.count({ where: { fechaIngreso: fechHoy } });
  const totalDiario = await Tubo.count({ where: { fechaIngreso: fechHoy } });
  const rechazo = await Tubo.count({
    where: { fechaIngreso: fechHoy, estado: 2 },
  });
  console.log(`*************TUBO**********`, rechazo);

  const { estado, tipoTubo, fechaToma, fechafin } = req.query;
  /* 
    console.log('FECHA TOMA', fechaToma);
    console.log('FECHA FIN', fechafin);
    console.log('ESTADO', estado);
    console.log('TIPO DE TUBO', tipoTubo); */
  let where = {};

  if (estado) {
    where.estado = {
      [Op.eq]: estado,
    };
  } else if (estado == null && tipoTubo) {
    where.tipoTubo = {
      [Op.eq]: tipoTubo,
    };
  } else if (estado == null && tipoTubo == null) {
    where.fechaIngreso = {
      [Op.between]: [fechaToma, fechafin],
    };
  }

  const dat = await Tubo.findAll({
    where,

    include: [
      {
        model: Cabecera,
        as: "pacientes",
        attributes: ["HORATOMA", "FECHATOMA", "CODSALA"],
      },
      {
        model: Envase,
        as: "envase",
        // attributes: ['HORATOMA', 'FECHATOMA'],
      },
    ],
  });

  res.status(200).json({
    ok: true,
    muestras: dat,
    totalDia: totalDiario,
    rechazo: rechazo,
    TotalTubos: TotalTubos,
  });
};

module.exports = { gettubos, postTubos, gettubo, updateTubo };
