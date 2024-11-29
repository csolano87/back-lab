const { Request, Response } = require("express");

const Roles = require("../models/role");
const { Op } = require("sequelize");
const Modelo = require("../models/modelo");
const Equipos = require("../models/equipos");
const Analizador = require("../models/analizador");
const Marca = require("../models/marca");
const Usuario = require("../models/usuarios");

const Unidadedad = require("../models/unidadedad");

const consultaunidadedad = async (req, res) => {
	const unidadedad = await Unidadedad.findAll({
		include: [
			/* {
				model: Usuario,
				as:"usuario"
			} */
		],
	});
	res.json({ ok: true, unidadedad });
};

const GetIDunidadedad = async (req, res) => {
	const { id } = req.params;
	const unidadedadId = await Unidadedad.findByPk(id);

	if (!unidadedadId) {
		return res.status(400).json({
			ok: false,
			msg: `El id ${id} no existe`,
		});
	}
	res.status(200).json({
		ok: true,
		unidadedadId,
	});
};

const Getfiltrounidadedad = async (req, res) => {
	const { busquedamodelo } = req.params;

	const dataCA = busquedamodelo.replace(/\w\S*/g, function (e) {
		return e.charAt(0).toUpperCase() + e.substring(1);
	});

	const unidadedad = await unidadedad.findAll({
		where: {
			NOMBRE: {
				[Op.like]: `%${dataCA}%`,
			},
		},
	});

	res.status(200).json({ ok: true, unidadedad });
};

const postunidadedad = async (req, res) => {
	const { DESCRIPCION } = req.body;
	const user = req.usuario;
	const unidadedades = new Unidadedad({ DESCRIPCION, usuarioId: user.id });

	await unidadedades.save();
	res.status(201).json({ msg: "Se registro con exito la categoria" });
};

const unidadedadUpdate = async (req, res) => {
	const { id, DESCRIPCION } = req.body;
	const unidadedadBD = await Unidadedad.findByPk(id);
	if (!unidadedadBD) {
		return res.status(404).json({
			ok: false,
			msg: `No existe el modelo ingresado`,
		});
	}
	await Unidadedad.update(
		{
			DESCRIPCION,
		},
		{ where: { id: id } }
	);

	res.status(200).json({
		ok: true,
		msg: `La unidadedad ${DESCRIPCION}a sido actualizado con exito..`,
	});
};

const unidadedadDelete = async (req, res) => {
	const { id } = req.params;
	const unidadedad = await Unidadedad.findByPk(id);

	if (!unidadedad) {
		return res
			.status(404)
			.json({ ok: false, msg: `La unidadedad ingresado no existe` });
	}
	await unidadedad.update({ ESTADO: 0 });
	res.status(200).json({
		msg: `La unidadedad ${unidadedad.DESCRIPCION} a sido desactivado con exito...`,
	});
};

module.exports = {
	unidadedadDelete,
	unidadedadUpdate,
	consultaunidadedad,
	postunidadedad,
	Getfiltrounidadedad,
	GetIDunidadedad,
};
