const { Request, Response } = require("express");

const Roles = require("../models/role");
const { Op, where } = require("sequelize");
const Estadofinancierocliente = require("../models/estadofinancierocliente");
const Usuario = require("../models/usuarios");

const consultaEstadocliente = async (req, res) => {
	const estadocliente = await Estadofinancierocliente.findAll({
		include:{
			model: Usuario,
			as:"usuario"
		}
	});

	res.json({ ok: true, estadocliente });
};

const GetIDEstadocliente = async (req, res) => {
	const { id } = req.params;
	const estadoclienteId = await Estadofinancierocliente.findByPk(id);

	if (!estadoclienteId) {
		return res.status(400).json({
			ok: false,
			msg: `El id ${id} no existe`,
		});
	}
	res.status(200).json({
		ok: true,
		estadoclienteId,
	});
};

const GetfiltroEstadocliente = async (req, res) => {
	const { busquedaestadocliente } = req.params;

	const dataCA = busquedaestadocliente.replace(/\w\S*/g, function (e) {
		return e.charAt(0).toUpperCase() + e.substring(1);
	});

	const estadocliente = await Estadofinancierocliente.findAll({
		where: {
			NOMBRE: {
				[Op.like]: `%${dataCA}%`,
			},
		},
	});

	res.status(200).json({ ok: true, estadocliente });
};

const postEstadocliente = async (req, res) => {
	const { NOMBRE } = req.body;
	const user = req.usuario;
	const estadoclientes = new Estadofinancierocliente({ NOMBRE ,CREATEDBY: user.id,
		usuarioId: user.id,});
	const estadocliente = await Estadofinancierocliente.findOne({
		where: {
			NOMBRE: NOMBRE,
		},
	});

	console.log(estadocliente);

	if (estadocliente) {
		return res.status(400).json({
			msg: "Este estado financiero cliente ya existe",
		});
	}

	await estadoclientes.save();
	res
		.status(201)
		.json({ msg: "El estado financiero cliente  a sido registrado con exito" });
};

const EstadoclienteUpdate = async (req, res) => {
	const id = req.body.id;

	const estadoclientes = await Estadofinancierocliente.findByPk(id);
	if (!estadoclientes) {
		return res
			.status(404)
			.json({ ok: true, msg: "no existe estado financiero cliente" });
	}

	const { NOMBRE } = req.body;

	await estadoclientes.update(
		{
			NOMBRE,
		},
		{ where: { id: id } }
	);

	res
		.status(200)
		.json({ ok: true, msg: `Se actualizo con exito el ${NOMBRE}` });
};

const EstadoclienteDelete = async (req, res) => {
	const id = req.params.id;
	const { NOMBRE } = req.body;
	const estadocliente = await Estadofinancierocliente.findByPk(id);
	if (!estadocliente) {
		return res.status(404).json({
			msg: "El estado financiero cliente  no existe...",
		});
	}
	await estadocliente.update({
		ESTADO: 0,
	});

	res.status(200).json({
		msg: `La  ${estadocliente.dataValues.NOMBRE} a sido desactivado con exito...`,
	});
};

module.exports = {
	EstadoclienteDelete,
	EstadoclienteUpdate,
	consultaEstadocliente,
	postEstadocliente,
	GetfiltroEstadocliente,
	GetIDEstadocliente,
};
