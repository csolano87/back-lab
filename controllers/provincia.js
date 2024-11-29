const { Request, Response } = require("express");
const Provincia = require("../models/provincia");
const Canton = require("../models/cantones");
const Parroquia = require("../models/parroquias");



const getprovincia = async (req, res) => {
	const provincias = await Provincia.findAll({
	include:{
		model: Canton,
		as:"cantones",
		include:{
			model: Parroquia,
			as:"parroquias"
		}
	}
	},);

	res.json({ ok: true, provincias });
};

const createprovincia = async (req, res) => {
	const { provincia } = req.body;
	const provincias = new Provincia({ provincia });
	const mar = await Provincia.findOne({
		where: {
			provincia: provincia,
		},
	});

	if (mar) {
		return res.status(400).json({
			msg: "El nombre ya se encuentra registrado ",
		});
	}
	await provincias.save();
	res.status(201).json({ msg: "La provincia  ha  registrado con exito" });
};

const updateprovincia = async (req, res) => {
	res.send("update guardada con exito..");
};

const deleteprovincia = async (req, res) => {
	res.status(200).json({
		msg: "El usuario a sido desactivado con exito...",
	});
};

module.exports = {
	createprovincia,
	updateprovincia,
	deleteprovincia,
	getprovincia,
};
