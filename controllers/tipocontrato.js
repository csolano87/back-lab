const { Request, Response } = require("express");

const Roles = require("../models/role");
const { Op } = require("sequelize");
const Modalidad = require("../models/modalidad");
const Tipocontrato = require("../models/tipocontrato");

const consultatipoContrato = async (req, res) => {
	const tipocontrato = await Tipocontrato.findAll();
	res.json({ ok: true, tipocontrato });
};

const GetIDtipoContrato = async (req, res) => {
	res.json({ usuarios });
};

const posttipoContrato = async (req, res) => {
	const { NOMBRE } = req.body;

	const tipos = new Tipocontrato({ NOMBRE });
	const tipo = await Tipocontrato.findOne({
		where: {
			NOMBRE: tipos.NOMBRE,
		},
	});

	if (tipo) {
		return res.status(400).json({
			msg: "El tipo de contrato  ya existe",
		});
	}

	await tipos.save();
	res.status(201).json({ msg: "Se registro el tipo de contrato  con exito" });
};

const tipoContratoUpdate = async (req, res) => {
	res.send("update guardada con exito..");
};

const tipoContratoDelete = async (req, res) => {
	const id = req.params.id;
	const tipo = await Tipocontrato.findByPk(id);
	if (!tipo) {
		return res.status(404).json({
			msg: "El tipo de contrato  no existe...",
		});
	}
	await tipo.update({ ESTADO: 0 });
	res.status(200).json({
		msg: "el tipo de contrato  a sido desactivado con exito...",
	});
};

module.exports = {
	tipoContratoDelete,
	tipoContratoUpdate,
	consultatipoContrato,
	posttipoContrato,
	GetIDtipoContrato,
};
