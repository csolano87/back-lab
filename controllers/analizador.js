const { Request, Response } = require("express");

const Equipos = require("../models/equipos");
const Modelo = require("../models/modelo");
const Marca = require("../models/marca");
const Ubicacion = require("../models/ubicacion");
const Estado = require("../models/estado");
const Accesorio = require("../models/accesorio");
const Analizador = require("../models/analizador");

const getAnalizador = async (req, res) => {
	const analizador = await Analizador.findAll({
		include: [
			{
				model: Modelo,
				as: "modelo",
			},
			{
				model: Marca,
				as: "marca",
			},

		],
		/* include:[
			{
				model: Modelo,
				as:"modelo"
			},
			{
				model: Marca,
				as:"marca"
			},
			{
				model: Ubicacion,
				as:"ubicacion"
			},
			{
				model: Estado,
				as:"estado"
			},
			{
				model: Accesorio,
				as:"acc"
			},
		] */
	});

	res.json({ ok: true, analizador });
};

const createAnalizador = async (req, res) => {
	console.log(req.body);
	const user = req.usuario;
	const { NOMBRE, CARACTERISTICA,modeloId,marcaId } = req.body;

	const nuevoAnalizador = new Analizador({
		NOMBRE,
		modeloId,
		marcaId,
		CARACTERISTICA,
		CREATEDBY:user.id,
		usuarioId:user.id
	});
	await nuevoAnalizador.save();

	return res.status(201).json({
		ok: true,
		msg: `El analizador ${NOMBRE} ha  registrado con exito`,
	});
};
const getBYIdAnalizador=async(req,res)=>{

	const { id } = req.params;
	const analizadorId = await Analizador.findByPk(id, 
		{
			model: Modelo,
			as: "modelo",
		},
		{
			model: Marca,
			as: "marca",
		},
	);

	if (!analizadorId) {
		return res.status(400).json({
			ok: false,
			msg: `El id ${id} no existe`,
		});
	}
	res.status(200).json({
		ok: true,
		analizadorId,
	});

}
const GetfiltroAnalizador = async (req, res) => {
	const { busquedaanalizador } = req.params;

	const dataCA = busquedaanalizador.replace(/\w\S*/g, function (e) {
		return e.charAt(0).toUpperCase() + e.substring(1);
	});

	const analizador = await Analizador.findAll({
		where: {
			NOMBRE: {
				[Op.like]: `%${dataCA}%`,
			},
		},
		
	});

	res.status(200).json({ ok: true, analizador });
};
const updateAnalizador = async (req, res) => {
	const id = req.body.id;

	const analizador = await Analizador.findByPk(id);
	if (!analizador) {
		return res.status(404).json({ ok: true, msg: "no existe analizador" });
	}

	const { NOMBRE, modeloId,CARACTERISTICA,marcaId} = req.body;

	await analizador.update(
		{
			NOMBRE,modeloId,CARACTERISTICA, marcaId,
		},
		{ where: { id: id } }
	);

	res.status(200).json({ ok: true, msg: `Se actualizo con exito el ${analizador.dataValues.NOMBRE}` });
};


const deleteAnalizador = async (req, res) => {
	const { id } = req.params;
	const analizador = await Analizador.findByPk(id);
	if (!analizador) {
		return res.status(404).json({
			msg: `No existe el analizador con el ${id}`,
		});
	}

	await analizador.update({ ESTADO: 0 });

	res.status(200).json({
		msg: "El analizador a sido desactivado con exito...",
	});
};

module.exports = {
	createAnalizador,
	updateAnalizador,
	deleteAnalizador,
	getAnalizador,
	GetfiltroAnalizador,
	getBYIdAnalizador,
};
