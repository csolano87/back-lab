const { Request, Response } = require("express");

const Roles = require("../models/role");
const { Op, where } = require("sequelize");
const Tiposervicio = require("../models/tiposervicio");


const consultaTiposervicio = async (req, res) => {
	const tiposervicio = await Tiposervicio.findAll({
		/* where: {
				rol: {
					[Op.ne]: "ADMIN",
				},
			}, */
	});

	res.json({ ok: true, tiposervicio });
};

const GetIDTiposervicio = async (req, res) => {
	res.json({ usuarios });
};

const postTiposervicio = async (req, res) => {
	const { nombre } = req.body;

	const tiposervicios = new Tiposervicio({ nombre });
	const tiposervicio = await Tiposervicio.findOne({
		where: {
			nombre: nombre,
		},
	});

	console.log(tiposervicio);

	if (tiposervicio) {
		return res.status(400).json({
			msg: "Este tiposervicio ya existe",
		});
	}

	await tiposervicios.save();
	res.status(201).json({ msg: "El tiposervicio  a sido registrado con exito" });
};

const TiposervicioUpdate = async (req, res) => {
	res.send("update guardada con exito..");
};

const TiposervicioDelete = async (req, res) => {
	const id = req.params.id;
	const { nombre } = req.body;
	const tiposervicio = await Tiposervicio.findByPk(id);
	if (!tiposervicio) {
		return res.status(404).json({
			msg: "El tiposervicio  no existe...",
		});
	}
	await tiposervicio.update({
		estado:0 }
	);

	res.status(200).json({
		msg: `El nombre ${tiposervicio.dataValues.nombre} a sido desactivado con exito...`,
	});
};

module.exports = {
	TiposervicioDelete,
	TiposervicioUpdate,
	consultaTiposervicio,
	postTiposervicio,
	GetIDTiposervicio,
};
