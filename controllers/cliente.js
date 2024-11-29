const { Request, Response } = require("express");
const Cliente = require("../models/cliente")


const getcliente = async (req, res) => {
	const cliente = await Cliente.findAll({
		where: {
			ESTADO: 1,
		},
	});

	res.json({ ok: true, clientes: cliente });
};

const createcliente = async (req, res) => {
	const { NOMBRE } = req.body;
	const cliente = new Cliente({ NOMBRE });
	const client = await Cliente.findOne({
		where: {
			NOMBRE: NOMBRE,
		},
	});

	if (client) {
		return res.status(400).json({
			msg: "El nombre ya se encuentra registrado ",
		});
	}
	await cliente.save();
	res.status(201).json({ msg: "El cliente  ha  registrado con exito" });
};

const updatecliente = async (req, res) => {
	res.send("update guardada con exito..");
};

const deletecliente = async (req, res) => {
	res.status(200).json({
		msg: "El usuario a sido desactivado con exito...",
	});
};

module.exports = {
	createcliente,
	updatecliente,
	deletecliente,
	getcliente,
};
