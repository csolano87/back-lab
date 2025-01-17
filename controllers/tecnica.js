const { Request, Response } = require("express");

const Roles = require("../models/role");
const { Op, where } = require("sequelize");
const Tecnica = require("../models/tecnica");



const consultaTecnica = async (req, res) => {
	const tecnica = await Tecnica.findAll({

	});

	res.json({ ok: true, tecnica });
};

const GetIDTecnica = async (req, res) => {
	const { id } = req.params;
console.log(id)
	const tecnicaID = await Tecnica.findByPk(id)
	if (!tecnicaID) {
		return res.status(404).json({
			ok: false,
			msg: `No existe la tecnica con id ${id}`
		})
	}
	console.log(tecnicaID)


	res.status(200).json({
		ok: true,
		estadoclienteId: tecnicaID
	});
};

const postTecnica = async (req, res) => {
	const { nombre } = req.body;

	const tecnicas = new Tecnica({ nombre });
	const tecnica = await Tecnica.findOne({
		where: {
			nombre: nombre,
		},
	});

	console.log(tecnica);

	if (tecnica) {
		return res.status(400).json({
			msg: "Este tecnica ya existe",
		});
	}

	await tecnicas.save();
	res.status(201).json({ msg: "La tecnica  a sido registrado con exito" });
};

const TecnicaUpdate = async (req, res) => {
	const id = req.body.id;
	const { nombre } = req.body;

	const tecnica = await Tecnica.findByPk(id);
	if (!tecnica) {
		return res.status(404).json({
			ok: true,
			msg: "no existe la tecnica"
		});
	}



	await tecnica.update(
		{
			nombre
		},
		{ where: { id: id } }



	);

	res.status(200).json({ ok: true, msg: `Se actualizo
		 con exito la tecnica` });
};

const TecnicaDelete = async (req, res) => {
	const id = req.params.id;
	const { nombre } = req.body;
	const tecnica = await Tecnica.findByPk(id);
	if (!tecnica) {
		return res.status(404).json({
			msg: "La tecnica  no existe...",
		});
	}
	await tecnica.update({
		estado: 0
	}
	);

	res.status(200).json({
		msg: `El nombre ${tecnica.dataValues.nombre} a sido desactivado con exito...`,
	});
};

module.exports = {
	TecnicaDelete,
	TecnicaUpdate,
	consultaTecnica,
	postTecnica,
	GetIDTecnica,
};
