const { Request, Response } = require("express");

const Roles = require("../models/role");
const { Op } = require("sequelize");
const Modalidad = require("../models/modalidad");

const consultamodalidad = async (req, res) => {
	const modalidad = await Modalidad.findAll({});
	res.json({ ok: true, modalidad });
};

const GetIDmodalidad = async (req, res) => {
	res.json({ usuarios });
};

const postmodalidad = async (req, res) => {
	const { NOMBRE } = req.body;

	const modalidades = new Modalidad({ NOMBRE });
	const modalidad = await Modalidad.findOne({
		where: {
			NOMBRE: modalidades.NOMBRE,
		},
	});

	

	if (modalidad) {
		return res.status(400).json({
			msg: "La modalidad  ya existe",
		});
	}

	await modalidades.save();
	res.status(201).json({ msg: "Se registro la modalidad  con exito" });
};

const modalidadUpdate = async (req, res) => {
	res.send("update guardada con exito..");
};

const modalidadDelete = async (req, res) => {

	const id = req.params.id;
	const modalidad = await Modalidad.findByPk(id);
	if (!modalidad) {


		res.status(404).json({
			msg: "La modalidad ingresada no existe...",
		});
	}
	await modalidad.update({ESTADO:0})
	res.status(200).json({
		msg: "La modalidad  a sido desactivado con exito...",
	});
};

module.exports = {
	modalidadDelete,
	modalidadUpdate,
	consultamodalidad,
	postmodalidad,
	GetIDmodalidad,
};
