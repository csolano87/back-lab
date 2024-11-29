const { Request, Response } = require("express");

const Roles = require("../models/role");
const { Op, where } = require("sequelize");
const Especialidad = require("../models/especialidad");




const consultaEspecialidad = async (req, res) => {
	const especialidad = await Especialidad.findAll({
		
	});

	res.json({ ok: true, especialidad });
};

const GetIDEspecialidad = async (req, res) => {
	res.json({ usuarios });
};

const postEspecialidad = async (req, res) => {
	const { especialidad
     } = req.body;

	const especialidads = new Especialidad({ especialidad });
	const especialida = await Especialidad.findOne({
		where: {
			especialidad: especialidad,
		},
	});

	console.log(especialida);

	if (especialida) {
		return res.status(400).json({
			msg: "Este Especialidad ya existe",
		});
	}

	await especialidads.save();
	res.status(201).json({ msg: "El Especialidad  a sido registrado con exito" });
};

const EspecialidadUpdate = async (req, res) => {
	res.send("update guardada con exito..");
};

const EspecialidadDelete = async (req, res) => {
	const id = req.params.id;
	const { especialidad } = req.body;
	const especialida = await Especialidad.findByPk(id);
	if (!especialida) {
		return res.status(404).json({
			msg: "El Especialidad  no existe...",
		});
	}
	await especialida.update({
		estado: 0,
	});

	res.status(200).json({
		msg: `El nombre ${especialida.dataValues.nombre} a sido desactivado con exito...`,
	});
};

module.exports = {
	EspecialidadDelete,
	EspecialidadUpdate,
	consultaEspecialidad,
	postEspecialidad,
	GetIDEspecialidad,
};
