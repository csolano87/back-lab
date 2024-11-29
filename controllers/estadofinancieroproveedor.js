const { Request, Response } = require("express");

const Roles = require("../models/role");
const { Op, where } = require("sequelize");
const Estadofinancieroproveedor = require("../models/estadofinancieroproveedor");
const Usuario = require("../models/usuarios");

const consultaestadoproveedor = async (req, res) => {
	const estadoproveedor = await Estadofinancieroproveedor.findAll({
		include:{
			model: Usuario,
			as:"usuario"
		}
	});

	res.json({ ok: true, estadoproveedor });
};

const GetIDestadoproveedor = async (req, res) => {
	const { id } = req.params;
	const estadoproveedorId = await Estadofinancieroproveedor.findByPk(id);

	if (!estadoproveedorId) {
		return res.status(400).json({
			ok: false,
			msg: `El id ${id} no existe`,
		});
	}
	res.status(200).json({
		ok: true,
		estadoproveedorId,
	});
};

const Getfiltroestadoproveedor = async (req, res) => {
	const { busquedaestadoproveedor } = req.params;

	const dataCA = busquedaestadoproveedor.replace(/\w\S*/g, function (e) {
		return e.charAt(0).toUpperCase() + e.substring(1);
	});

	const estadoproveedor = await Estadofinancieroproveedor.findAll({
		where: {
			NOMBRE: {
				[Op.like]: `%${dataCA}%`,
			},
		},
	});

	res.status(200).json({ ok: true, estadoproveedor });
};

const postestadoproveedor = async (req, res) => {
	const { NOMBRE } = req.body;
	const user = req.usuario;
	const estadoproveedors = new Estadofinancieroproveedor({ NOMBRE ,CREATEDBY: user.id,
		usuarioId: user.id,});
	const estadoproveedor = await Estadofinancieroproveedor.findOne({
		where: {
			NOMBRE: NOMBRE,
		},
	});

	console.log(estadoproveedor);

	if (estadoproveedor) {
		return res.status(400).json({
			msg: "Este estado financiero proveedor ya existe",
		});
	}

	await estadoproveedors.save();
	res
		.status(201)
		.json({ msg: "El estado financiero proveedor  a sido registrado con exito" });
};

const estadoproveedorUpdate = async (req, res) => {
	const id = req.body.id;

	const estadoproveedors = await Estadofinancieroproveedor.findByPk(id);
	if (!estadoproveedors) {
		return res
			.status(404)
			.json({ ok: true, msg: "no existe estado financiero proveedor" });
	}

	const { NOMBRE } = req.body;

	await estadoproveedors.update(
		{
			NOMBRE,
		},
		{ where: { id: id } }
	);

	res
		.status(200)
		.json({ ok: true, msg: `Se actualizo con exito el ${NOMBRE}` });
};

const estadoproveedorDelete = async (req, res) => {
	const id = req.params.id;
	const { NOMBRE } = req.body;
	const estadoproveedor = await Estadofinancieroproveedor.findByPk(id);
	if (!estadoproveedor) {
		return res.status(404).json({
			msg: "El estado financiero proveedor  no existe...",
		});
	}
	await estadoproveedor.update({
		ESTADO: 0,
	});

	res.status(200).json({
		msg: `La  ${estadoproveedor.dataValues.NOMBRE} a sido desactivado con exito...`,
	});
};

module.exports = {
	estadoproveedorDelete,
	estadoproveedorUpdate,
	consultaestadoproveedor,
	postestadoproveedor,
	Getfiltroestadoproveedor,
	GetIDestadoproveedor,
};
