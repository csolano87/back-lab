const { Request, Response } = require("express");

const Roles = require("../models/role");
const { Op } = require("sequelize");
const Modelo = require("../models/modelo");
const Equipos = require("../models/equipos");
const Analizador = require("../models/analizador");
const Marca = require("../models/marca");
const Usuario = require("../models/usuarios");
const tipofisiologico = require("../models/tipofisiologico");
const Tipofisiologico = require("../models/tipofisiologico");

const consultatipofisiologico = async (req, res) => {
	const tipofisiologico = await Tipofisiologico.findAll({
		include: [
			/* {
				model: Usuario,
				as:"usuario"
			} */
		],
	});
	res.json({ ok: true, tipofisiologico });
};

const GetIDtipofisiologico = async (req, res) => {
	const { id } = req.params;
	const tipofisiologicoId = await Tipofisiologico.findByPk(id);

	if (!tipofisiologicoId) {
		return res.status(400).json({
			ok: false,
			msg: `El id ${id} no existe`,
		});
	}
	res.status(200).json({
		ok: true,
		tipofisiologicoId,
	});
};

const Getfiltrotipofisiologico = async (req, res) => {
	const { busquedamodelo } = req.params;

	const dataCA = busquedamodelo.replace(/\w\S*/g, function (e) {
		return e.charAt(0).toUpperCase() + e.substring(1);
	});

	const tipofisiologico = await Tipofisiologico.findAll({
		where: {
			NOMBRE: {
				[Op.like]: `%${dataCA}%`,
			},
		},
	});

	res.status(200).json({ ok: true, tipofisiologico });
};

const posttipofisiologico = async (req, res) => {
	const { DESCRIPCION } = req.body;
	const user = req.usuario;
	const tipofisiologicoes = new Tipofisiologico({ DESCRIPCION, usuarioId: user.id });

	await tipofisiologicoes.save();
	res.status(201).json({ msg: "Se registro con exito la categoria" });
};

const tipofisiologicoUpdate = async (req, res) => {
	const { id, DESCRIPCION } = req.body;
	const tipofisiologicoBD = await Tipofisiologico.findByPk(id);
	if (!tipofisiologicoBD) {
		return res.status(404).json({
			ok: false,
			msg: `No existe el modelo ingresado`,
		});
	}
	await tipofisiologico.update(
		{
			DESCRIPCION,
		},
		{ where: { id: id } }
	);

	res.status(200).json({
		ok: true,
		msg: `La tipofisiologico ${DESCRIPCION}a sido actualizado con exito..`,
	});
};

const tipofisiologicoDelete = async (req, res) => {
	const { id } = req.params;
	const tipofisiologico = await Tipofisiologico.findByPk(id);

	if (!tipofisiologico) {
		return res
			.status(404)
			.json({ ok: false, msg: `La tipofisiologico ingresado no existe` });
	}
	await tipofisiologico.update({ ESTADO: 0 });
	res.status(200).json({
		msg: `La tipofisiologico ${tipofisiologico.DESCRIPCION} a sido desactivado con exito...`,
	});
};

module.exports = {
	tipofisiologicoDelete,
	tipofisiologicoUpdate,
	consultatipofisiologico,
	posttipofisiologico,
	Getfiltrotipofisiologico,
	GetIDtipofisiologico,
};
