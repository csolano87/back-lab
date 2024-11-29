const { Request, Response } = require("express");

const Roles = require("../models/role");
const { Op, where } = require("sequelize");
const estado = require("../models/estado");
const Estado = require("../models/estado");
const Usuario = require("../models/usuarios");

const consultaestado = async (req, res) => {
	const estado = await Estado.findAll({
		include:{
			model: Usuario,
			as:"usuario"
		}
	});

	res.json({ ok: true, estado });
};

const GetIDestado = async (req, res) => {
	const { id } = req.params;
	const estadoId = await Estado.findByPk(id);

	if (!estadoId) {
		return res.status(400).json({
			ok: false,
			msg: `El id ${id} no existe`,
		});
	}
	res.status(200).json({
		ok: true,
		estadoId,
	});
};
const GetfiltroEstado = async (req, res) => {
	const { busquedaestado } = req.params;

	const dataCA = busquedaestado.replace(/\w\S*/g, function (e) {
		return e.charAt(0).toUpperCase() + e.substring(1);
	});

	const estado = await Estado.findAll({
		where: {
			NOMBRE: {
				[Op.like]: `%${dataCA}%`,
			},
		},
	});

	res.status(200).json({ ok: true, estado });
};
const postestado = async (req, res) => {
	const { NOMBRE, color } = req.body;
	const user = req.usuario;
	const estados = new Estado({
		NOMBRE,
		color,
		CREATEDBY: user.id,
		usuarioId: user.id,
	});
	const estado = await Estado.findOne({
		where: {
			NOMBRE: NOMBRE,
		},
	});

	console.log(estado);

	if (estado) {
		return res.status(400).json({
			msg: "Este estado ya existe",
		});
	}

	await estados.save();
	res.status(201).json({ msg: "El estado  a sido registrado con exito" });
};

const estadoUpdate = async (req, res) => {
	const id = req.body.id;

	const estado = await Estado.findByPk(id);
	if (!estado) {
		return res.status(404).json({ ok: true, msg: "no existe estado" });
	}

	const { NOMBRE, color } = req.body;

	await estado.update(
		{
			NOMBRE,
			color,
		},
		{ where: { id: id } }
	);

	res
		.status(200)
		.json({ ok: true, msg: `Se actualizo con exito el ${NOMBRE}` });
};

const estadoDelete = async (req, res) => {
	const id = req.params.id;
	const { NOMBRE } = req.body;
	const estado = await Estado.findByPk(id);
	if (!estado) {
		return res.status(404).json({
			msg: "El estado  no existe...",
		});
	}
	await estado.update({
		ESTADO: 0,
	});

	res.status(200).json({
		msg: `El  ${estado.dataValues.NOMBRE} a sido desactivado con exito...`,
	});
};

module.exports = {
	estadoDelete,
	estadoUpdate,
	GetfiltroEstado,
	consultaestado,
	postestado,
	GetIDestado,
};
