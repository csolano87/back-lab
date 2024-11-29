const { Request, Response } = require("express");

const Solicitudrepuesto = require("../models/role");
const { Op } = require("sequelize");

const consultaSolicitudPresupuesto = async (req, res) => {
	/* 
		const rol = await Solicitudrepuesto.findAll({
			where: {
				rol: {
					[Op.ne]: "ADMIN",
				},
			},
		});
		
		res.json({ ok: true, rol }); */

};

const GetIDSolicitudPresupuesto = async (req, res) => {
	res.json({ usuarios });
};

const postSolicitudPresupuesto = async (req, res) => {
	/* const { rol } = req.body;

	const Solicitudrepuesto = new Solicitudrepuesto({ rol });
	const role = await Solicitudrepuesto.findOne({
		where: {
			rol: Solicitudrepuesto.rol,
		},
	});

	console.log(role);

	if (role) {
		return res.status(400).json({
			msg: "Este rol ya existe",
		});
	}

	await Solicitudrepuesto.save(); */
	res.status(201).json({ msg: "El rol a sido registrado con exito" });
};

const SolicitudPresupuestoUpdate = async (req, res) => {
	res.send("update guardada con exito..");
};

const SolicitudPresupuestoDelete = async (req, res) => {
	res.status(200).json({
		msg: "El usuario a sido desactivado con exito...",
	});
};

module.exports = {
	SolicitudPresupuestoDelete,
	SolicitudPresupuestoUpdate,
	consultaSolicitudPresupuesto,
	postSolicitudPresupuesto,
    GetIDSolicitudPresupuesto
};
