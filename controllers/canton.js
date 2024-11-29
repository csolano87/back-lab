const { Request, Response } = require("express");
const Canton = require("../models/cantones");



const getcanton = async (req, res) => {
	const canton = await Canton.findAll({
		where: {
			estado: 1,
		},
	});

	res.json({ ok: true,  canton });
};

const createcanton = async (req, res) => {
	const { canton, provinciaId } = req.body;
	const cantones = new Canton({ canton ,provinciaId});
	const mar = await Canton.findOne({
		where: {
			canton: canton,
		},
	});

	if (mar) {
		return res.status(400).json({
			msg: "El nombre ya se encuentra registrado ",
		});
	}
	await cantones.save();
	res.status(201).json({ msg: "La canton  ha  registrado con exito" });
};

const updatecanton = async (req, res) => {
	res.send("update guardada con exito..");
};

const deletecanton = async (req, res) => {
	res.status(200).json({
		msg: "El usuario a sido desactivado con exito...",
	});
};

module.exports = {
	createcanton,
	updatecanton,
	deletecanton,
	getcanton,
};
