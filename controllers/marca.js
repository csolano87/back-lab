const { Request, Response } = require("express");

const Marca = require("../models/marca");
const Usuario = require("../models/usuarios");
const { includes } = require("lodash");
const Modelo = require("../models/modelo");
const Analizador = require("../models/analizador");

const getmarca = async (req, res) => {
	const marca = await Marca.findAll({
		/* where: {
			ESTADO: 1,
		}, */
		include: [
			{
				model: Usuario,
				as: "usuario",
			},
			{
				model: Modelo,
				as: "modelo",
				include: {
					model: Analizador,
					as: "instrumento",
				},
			},
		],
	});

	res.json({ ok: true, marcas: marca });
};

const getByIDmarca = async (req, res) => {
	const { id } = req.params;
	const marcaId = await Marca.findByPk(id);

	if (!marcaId) {
		return res.status(400).json({
			ok: false,
			msg: `El id ${id} no existe`,
		});
	}
	res.status(200).json({
		ok: true,
		marcaId,
	});
};

const Getfiltomarca = async (req, res) => {
	const { busquedamarca } = req.params;

	const dataCA = busquedamarca.replace(/\w\S*/g, function (e) {
		return e.charAt(0).toUpperCase() + e.substring(1);
	});

	const marca = await Marca.findAll({
		where: {
			NOMBRE: {
				[Op.like]: `%${dataCA}%`,
			},
		},
	});

	res.status(200).json({ ok: true, marca });
};

const createmarca = async (req, res) => {
	const { NOMBRE } = req.body;
	const user = req.usuario;
	console.log(user);
	const marca = new Marca({ NOMBRE, CREATEDBY: user.id, usuarioId: user.id });
	const mar = await Marca.findOne({
		where: {
			NOMBRE: NOMBRE,
		},
	});

	if (mar) {
		return res.status(400).json({
			msg: "El nombre ya se encuentra registrado ",
		});
	}
	await marca.save();
	res.status(201).json({ msg: "La marca  ha  registrado con exito" });
};

const updatemarca = async (req, res) => {
	const id = req.body.id;

	const marca = await Marca.findByPk(id);
	if (!marca) {
		return res.status(404).json({ ok: true, msg: "no existe marca" });
	}

	const { NOMBRE } = req.body;

	await marca.update(
		{
			NOMBRE,
		},
		{ where: { id: id } }
	);

	res
		.status(200)
		.json({ ok: true, msg: `Se actualizo con exito el ${NOMBRE}` });
};

const deletemarca = async (req, res) => {
	const id = req.params.id;
	const { NOMBRE } = req.body;
	const marca = await Marca.findByPk(id);
	if (!marca) {
		return res.status(404).json({
			msg: "la marca  no existe...",
		});
	}
	await marca.update({
		ESTADO: 0,
	});

	res.status(200).json({
		msg: `la  ${marca.dataValues.NOMBRE} a sido desactivado con exito...`,
	});
};

module.exports = {
	createmarca,
	getByIDmarca,
	deletemarca,
	updatemarca,
	Getfiltomarca,
	getmarca,
};
