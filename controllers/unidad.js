const { Request, Response } = require("express");

const Roles = require("../models/role");
const { Op } = require("sequelize");
const Modelo = require("../models/modelo");
const Equipos = require("../models/equipos");
const Analizador = require("../models/analizador");
const Marca = require("../models/marca");
const Usuario = require("../models/usuarios");
const Unidad = require("../models/unidad");

const consultaunidad = async (req, res) => {
	const unidad = await Unidad.findAll({
		include: [
		

			/* {
				model: Usuario,
				as:"usuario"
			} */
			
		],
	});
	res.json({ ok: true, unidad });
};

const GetIDunidad = async (req, res) => {
	const { id } = req.params;
	const unidadId = await Unidad.findByPk(id);

	if (!unidadId) {
		return res.status(400).json({
			ok: false,
			msg: `El id ${id} no existe`,
		});
	}
	res.status(200).json({
		ok: true,
		unidadId,
	});
};

const Getfiltrounidad = async (req, res) => {
	const { busquedamodelo } = req.params;

	const dataCA = busquedamodelo.replace(/\w\S*/g, function (e) {
		return e.charAt(0).toUpperCase() + e.substring(1);
	});

	const unidad = await Unidad.findAll({
		where: {
			NOMBRE: {
				[Op.like]: `%${dataCA}%`,
			},
		},
	});

	res.status(200).json({ ok: true, unidad });
};

const postunidad = async (req, res) => {
	const { DESCRIPCION } = req.body;
	const user = req.usuario;
	const unidades = new Unidad({ DESCRIPCION,
		usuarioId:user.id });


	await unidades.save();
	res.status(201).json({ msg: "Se registro con exito la categoria" });
};

const unidadUpdate = async (req, res) => {
	const { id,  DESCRIPCION} = req.body;
	const unidadBD = await Unidad.findByPk(id);
	if (!unidadBD) {
		return res.status(404).json({
			ok: false,
			msg: `No existe el modelo ingresado`,
		});
	}
	await Unidad.update(
		{
			DESCRIPCION
		},
		{ where: { id: id } }
	);

	res.status(200).json({
		ok: true,
		msg: `La unidad ${DESCRIPCION}a sido actualizado con exito..`,
	});
};

const unidadDelete = async (req, res) => {
	const { id } = req.params;
	const unidad = await Unidad.findByPk(id);

	if (!unidad) {
		return res
			.status(404)
			.json({ ok: false, msg: `La unidad ingresado no existe` });
	}
	await unidad.update({ ESTADO: 0 });
	res.status(200).json({
		msg: `La unidad ${unidad.DESCRIPCION} a sido desactivado con exito...`,
	});
};

module.exports = {
	unidadDelete,
	unidadUpdate,
	consultaunidad,
	postunidad,
	Getfiltrounidad,
	GetIDunidad,
};
