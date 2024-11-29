const { Request, Response } = require("express");

const Roles = require("../models/role");
const { Op, where } = require("sequelize");
const Tipogrupo = require("../models/tipogrupo");



const consultaTipogrupo = async (req, res) => {
	const tipogrupo = await Tipogrupo.findAll({
		
	});

	res.json({ ok: true, tipogrupo });
};

const GetIDTipogrupo = async (req, res) => {
	res.json({ usuarios });
};

const postTipogrupo = async (req, res) => {
	const { nombre } = req.body;

	const tipogrupos = new Tipogrupo({ nombre });
	const tipogrupo = await Tipogrupo.findOne({
		where: {
			nombre: nombre,
		},
	});

	console.log(tipogrupo);

	if (tipogrupo) {
		return res.status(400).json({
			msg: "Este tipogrupo ya existe",
		});
	}

	await tipogrupos.save();
	res.status(201).json({ msg: "El Tipogrupo  a sido registrado con exito" });
};

const TipogrupoUpdate = async (req, res) => {
	res.send("update guardada con exito..");
};

const TipogrupoDelete = async (req, res) => {
	const id = req.params.id;
	const { nombre } = req.body;
	const tipogrupo = await Tipogrupo.findByPk(id);
	if (!tipogrupo) {
		return res.status(404).json({
			msg: "El Tipogrupo  no existe...",
		});
	}
	await tipogrupo.update({
		estado: 0,
	});

	res.status(200).json({
		msg: `El nombre ${tipogrupo.dataValues.nombre} a sido desactivado con exito...`,
	});
};

module.exports = {
	TipogrupoDelete,
	TipogrupoUpdate,
	consultaTipogrupo,
	postTipogrupo,
	GetIDTipogrupo,
};
