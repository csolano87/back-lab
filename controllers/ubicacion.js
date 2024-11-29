const { Request, Response } = require("express");

const Roles = require("../models/role");
const { Op, where } = require("sequelize");
const ubicacion = require("../models/ubicacion");
const Ubicacion = require("../models/ubicacion");
const Usuario = require("../models/usuarios");

const consultaubicacion = async (req, res) => {
	const ubicacion = await Ubicacion.findAll({
		/* where: {
				rol: {
					[Op.ne]: "ADMIN",
				},
			}, */
			include:{
				model: Usuario,
				as:"usuario"
			}
	});

	res.json({ ok: true, ubicacion });
};

const GetIDubicacion = async (req, res) => {
	const { id } = req.params;
	const ubicacionId = await Ubicacion.findByPk(id, );

	if (!ubicacionId) {
		return res.status(400).json({
			ok: false,
			msg: `El id ${id} no existe`,
		});
	}
	res.status(200).json({
		ok: true,
		ubicacionId,
	});
};


const GetfiltroUbicacion = async (req, res) => {
	const { busquedaubicacion } = req.params;

	const dataCA = busquedaubicacion.replace(/\w\S*/g, function (e) {
		return e.charAt(0).toUpperCase() + e.substring(1);
	});

	const ubicacion = await Ubicacion.findAll({
		where: {
			NOMBRE: {
				[Op.like]: `%${dataCA}%`,
			},
		},
	});

	res.status(200).json({ ok: true, ubicacion });
};

const postubicacion = async (req, res) => {
	const { NOMBRE } = req.body;
	const user = req.usuario;
	const ubicacions = new Ubicacion({ NOMBRE,CREATEDBY:user.id,
		usuarioId:user.id });
	const ubicacion = await Ubicacion.findOne({
		where: {
			NOMBRE: NOMBRE,
		},
	});

	console.log(ubicacion);

	if (ubicacion) {
		return res.status(400).json({
			msg: "Este ubicacion ya existe",
		});
	}

	await ubicacions.save();
	res.status(201).json({ msg: "El ubicacion  a sido registrado con exito" });
};

const ubicacionUpdate = async (req, res) => {
	const id = req.body.id;

	const ubicacions = await Ubicacion.findByPk(id);
	if (!ubicacions) {
		return res.status(404).json({ ok: true, msg: "no existe ubicacion" });
	}

	const { NOMBRE } = req.body;

	await ubicacions.update(
		{
			NOMBRE
		},
		{ where: { id: id } }
	);

	res.status(200).json({ ok: true, msg: `Se actualizo con exito el ${NOMBRE}` });
};

const ubicacionDelete = async (req, res) => {
	const id = req.params.id;
	const { NOMBRE } = req.body;
	const ubicacion = await Ubicacion.findByPk(id);
	if (!ubicacion) {
		return res.status(404).json({
			msg: "El ubicacion  no existe...",
		});
	}
	await ubicacion.update({
		ESTADO:0 }
	);

	res.status(200).json({
		msg: `La  ${ubicacion.dataValues.NOMBRE} a sido desactivado con exito...`,
	});
};

module.exports = {
	ubicacionDelete,
	ubicacionUpdate,
	consultaubicacion,
	postubicacion,
	GetfiltroUbicacion,
	GetIDubicacion,
};
