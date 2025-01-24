const { Request, Response } = require("express");

const Roles = require("../models/role");
const { Op, where } = require("sequelize");
const Diagnostico = require("../models/Diagnostico");


const consultaDiagnostico = async (req, res) => {
	const diagnostico = await Diagnostico.findAll({
		/* where: {
				rol: {
					[Op.ne]: "ADMIN",
				},
			}, */
	});

	res.json({ ok: true, diagnostico });
};

const GetIDDiagnostico = async (req, res) => {
	const { id } = req.params;
	console.log(id)
		const tecnicaID = await Diagnostico.findByPk(id)
		if (!tecnicaID) {
			return res.status(404).json({
				ok: false,
				msg: `No existe el diagnostico  con id ${id}`
			})
		}
		console.log(tecnicaID)
	
	
		res.status(200).json({
			ok: true,
			estadoclienteId: tecnicaID
		});
};

const postDiagnostico = async (req, res) => {
	const { nombre } = req.body;

	const diagnosticos = new Diagnostico({ nombre });
	const diagnostico = await Diagnostico.findOne({
		where: {
			nombre: nombre,
		},
	});

	console.log(diagnostico);

	if (diagnostico) {
		return res.status(400).json({
			msg: "Este diagnostico ya existe",
		});
	}

	await diagnosticos.save();
	res.status(201).json({ msg: "El diagnostico  a sido registrado con exito" });
};

const DiagnosticoUpdate = async (req, res) => {
	const id = req.params.id;
	const { nombre } = req.body;
	const diagnostico = await Diagnostico.findByPk(id);
	if (!diagnostico) {
		return res.status(404).json({
			msg: "El diagnostico  no existe...",
		});
	}
	await diagnostico.update({
		nombre:nombre
	})
	res.status(200).json({
		msg: `El diagnostico ${diagnostico.dataValues.nombre} se actualizo  con exito...`,
	});
};

const DiagnosticoDelete = async (req, res) => {
	const id = req.params.id;
	const { nombre } = req.body;
	const diagnostico = await Diagnostico.findByPk(id);
	if (!diagnostico) {
		return res.status(404).json({
			msg: "El diagnostico  no existe...",
		});
	}
	await diagnostico.update({
		estado:0 }
	);

	res.status(200).json({
		msg: `El nombre ${diagnostico.dataValues.nombre} a sido desactivado con exito...`,
	});
};

module.exports = {
	DiagnosticoDelete,
	DiagnosticoUpdate,
	consultaDiagnostico,
	postDiagnostico,
	GetIDDiagnostico,
};
