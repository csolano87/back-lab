const { Request, Response } = require("express");

const Roles = require("../models/role");
const { Op, where } = require("sequelize");
const Muestra = require("../models/muestras");

const consultaMuestra = async (req, res) => {
	const muestra = await Muestra.findAll({});

	res.json({ ok: true, muestra });
};

const GetIDMuestra = async (req, res) => {
	res.json({ usuarios });
};

const postMuestra = async (req, res) => {
	const { nombre } = req.body;

	const muestras = new Muestra({ nombre });
	const muestra = await Muestra.findOne({
		where: {
			nombre: nombre,
		},
	});

	console.log(muestra);

	if (muestra) {
		return res.status(400).json({
			msg: "Este muestra ya existe",
		});
	}

	await muestras.save();
	res.status(201).json({ msg: "La Muestra  a sido registrado con exito" });
};

const MuestraUpdate = async (req, res) => {
	res.send("update guardada con exito..");
};

const MuestraDelete = async (req, res) => {
	const id = req.params.id;
	const { nombre } = req.body;
	const muestra = await Muestra.findByPk(id);
	if (!muestra) {
		return res.status(404).json({
			msg: "La Muestra  no existe...",
		});
	}
	await muestra.update({
		estado: 0,
	});

	res.status(200).json({
		msg: `El nombre ${muestra.dataValues.nombre} a sido desactivado con exito...`,
	});
};

module.exports = {
	MuestraDelete,
	MuestraUpdate,
	consultaMuestra,
	postMuestra,
	GetIDMuestra,
};
