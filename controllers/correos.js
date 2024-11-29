const { Request, Response } = require("express");

const { Op } = require("sequelize");
const Correo = require("../models/correos");

const consultacorreo = async (req, res) => {
	const correo = await Correo.findAll();

	res.json({ ok: true, correo });
};

const correoGetID = async (req, res) => {
	res.json({ usuarios });
};

const createcorreo = async (req, res) => {
	const { nombres, apellidos, correo ,empresa} = req.body;

	const correos = new Correo({ nombres, apellidos, correo,empresa });
	const coreo = await Correo.findOne({
		where: {
			correo: correos.correo,
		},
	});

	console.log(coreo);

	if (coreo) {
		return res.status(400).json({
			msg: "Este correo ya existe",
		});
	}

	await correos.save();
	res.status(201).json({ msg: "Se  registrado con exito" });
};

const correoUpdate = async (req, res) => {
	res.send("update guardada con exito..");
};

const correoDelete = async (req, res) => {
	res.status(200).json({
		msg: "El usuario a sido desactivado con exito...",
	});
};

module.exports = {
	createcorreo,
	consultacorreo,
	correoUpdate,
	correoGetID,
	correoUpdate,
	correoDelete,
};
