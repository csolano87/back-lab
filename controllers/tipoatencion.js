const { Request, Response } = require("express");

const Roles = require("../models/role");
const { Op, where } = require("sequelize");
const Tipoatencion = require("../models/Tipoatencion");



const consultaTipoatencion = async (req, res) => {
	const tipoatencion = await Tipoatencion.findAll({
		/* where: {
				rol: {
					[Op.ne]: "ADMIN",
				},
			}, */
	});

	res.json({ ok: true, tipoatencion });
};

const GetIDTipoatencion = async (req, res) => {
	res.json({ usuarios });
};

const postTipoatencion = async (req, res) => {
	const { nombre } = req.body;

	const tipoatencions = new Tipoatencion({ nombre });
	const tipoatencion = await Tipoatencion.findOne({
		where: {
			nombre: nombre,
		},
	});

	console.log(tipoatencion);

	if (tipoatencion) {
		return res.status(400).json({
			msg: "Este tipoatencion ya existe",
		});
	}

	await tipoatencions.save();
	res.status(201).json({ msg: "El tipoatencion  a sido registrado con exito" });
};

const TipoatencionUpdate = async (req, res) => {
	res.send("update guardada con exito..");
};

const TipoatencionDelete = async (req, res) => {
	const id = req.params.id;
	const { nombre } = req.body;
	const tipoatencion = await Tipoatencion.findByPk(id);
	if (!tipoatencion) {
		return res.status(404).json({
			msg: "El tipoatencion  no existe...",
		});
	}
	await tipoatencion.update({
		estado:0 }
	);

	res.status(200).json({
		msg: `El nombre ${tipoatencion.dataValues.nombre} a sido desactivado con exito...`,
	});
};

module.exports = {
	TipoatencionDelete,
	TipoatencionUpdate,
	consultaTipoatencion,
	postTipoatencion,
	GetIDTipoatencion,
};
