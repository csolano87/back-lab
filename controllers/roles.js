const { Request, Response } = require("express");

const Roles = require("../models/role");
const { Op } = require("sequelize");

const consultaroles = async (req, res) => {
	if (req.usuario.rol === "TICS") {
		const rol = await Roles.findAll({
			where: {
				rol: {
					[Op.ne]: "ADMIN",
				},
			},
		});
		res.json({ ok: true, rol });
	} else {
		const rol = await Roles.findAll();

	res.json({ ok: true, rol });
	}
	
};

const usuariosGetID = async (req, res) => {
	res.json({ usuarios });
};

const createroles = async (req, res) => {
	const { rol } = req.body;

	const roles = new Roles({ rol });
	const role = await Roles.findOne({
		where: {
			rol: roles.rol,
		},
	});

	console.log(role);

	if (role) {
		return res.status(400).json({
			msg: "Este rol ya existe",
		});
	}

	await roles.save();
	res.status(201).json({ msg: "El rol a sido registrado con exito" });
};

const usuariosUpdate = async (req, res) => {
	res.send("update guardada con exito..");
};

const usuariosDelete = async (req, res) => {
	res.status(200).json({
		msg: "El usuario a sido desactivado con exito...",
	});
};

module.exports = { createroles, consultaroles };
