const { Request, Response } = require("express");
const Parroquia = require("../models/parroquias");


const getParroquia = async (req, res) => {
	const parroquia = await Parroquia.findAll({
		where: {
			estado: 1,
		},
	});

	res.json({ ok: true, parroquia });
};

const createParroquia = async (req, res) => {
	const { parroquia, cantonId} = req.body;
	const parroquias = new Parroquia({ parroquia,cantonId });
	const mar = await Parroquia.findOne({
		where: {
			parroquia: parroquia,
		},
	});

	if (mar) {
		return res.status(400).json({
			msg: "El nombre ya se encuentra registrado ",
		});
	}
	await parroquias.save();
	res.status(201).json({ msg: "La Parroquia  ha  registrado con exito" });
};

const updateParroquia = async (req, res) => {
	res.send("update guardada con exito..");
};

const deleteParroquia = async (req, res) => {
	res.status(200).json({
		msg: "El usuario a sido desactivado con exito...",
	});
};

module.exports = {
	createParroquia,
	updateParroquia,
	deleteParroquia,
	getParroquia,
};
