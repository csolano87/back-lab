const { Request, Response } = require("express");
const Impresora = require("../models/impresora");
const Panel_pruebas = require("../models/panelPruebas");
const Modelo = require("../models/modelo");
const csvToJson = require("convert-csv-to-json");
const Muestra = require("../models/muestras");
const Tecnica = require("../models/tecnica");
const getpanelPruebas = async (req, res) => {
	const listapruebas = await Panel_pruebas.findAll({
		include: [
			{
				model: Modelo,
				as: "modelo",
			},
			{
				model: Muestra,
				as: "muestra",
			},
			{
				model: Tecnica,
				as: "tecnica",
			},
		],
	});

	res.json({ ok: true, listapruebas });
};

const getIdpruebas = async (req, res) => {
	const { id } = req.params;

	console.log(id);

	const listapruebas = await Panel_pruebas.findByPk(id);
	if (!listapruebas) {
		return res
			.status(400)
			.json({ ok: false, msg: `La prueba con la ID ${id} no existe` });
	}
	res.status(200).json({ ok: true, listapruebas });
};
const createpanelPruebas = async (req, res) => {
	const {
		CODIGO,
		ABREV,
		ORDEN,
		NOMBRE,
		muestraId,
		tecnicaId,
		modeloId,
		TIEMPO,
		VALOR,
		favorite,

		CODEXTERNO,
	} = req.body;
	const panelPruebas = new Panel_pruebas({
		CODIGO,
		ABREV,
		ORDEN,
		NOMBRE,
		muestraId,
		tecnicaId,
		modeloId,
		TIEMPO,
		VALOR,
		favorite,

		CODEXTERNO,
	});
	const panel = await Panel_pruebas.findOne({
		where: {
			CODIGO: CODIGO,
		},
	});
	console.log(panel)
	if (panel) {
		return res.status(400).json({
			msg: "Este codigo de pruebas   ya existe",
		});
	}
	await panelPruebas.save();
	res.status(201).json({ msg: "La prueba  ha  registrado con exito" });
};

const cargaexcelPanelpruebas = async (req, res) => {
	if (!req.file) {
		return res.status(400).json({ ok: false, msg: `No existe archivo` });
	}
	let fileInputName = req.file.path;

	let json = csvToJson.getJsonFromCsv(fileInputName);
	//res.json({json})

	let productosGuardados = [];
	let productosDuplicados = [];
	for (const jsondata of json) {
		const datexistente = await Panel_pruebas.findOne({
			where: { CODIGO: jsondata.CODIGO },
		});

		if (!datexistente) {
			const guardarProducto = await Panel_pruebas.create(jsondata);
			productosGuardados.push(guardarProducto);
		} else {
			/* const existente = datexistente.map((ext)=>ext.producto)*/
			productosDuplicados.push(datexistente);
		}
	}

	const parseDuplicados = productosDuplicados.map(
		(ext) => ext.dataValues.CODIGO
	);
	const parseGuardados = productosGuardados.map((ext) => ext.dataValues.CODIGO);

	if (productosGuardados.length > 0 && productosDuplicados.length > 0) {
		res.status(200).json({
			ok: true,
			msg: `Se han guardado con exito estos productos ${parseGuardados}, pero existen productos duplicados
                ${parseDuplicados},`,
		});
	} else if (productosGuardados.length > 0 && productosDuplicados.length == 0) {
		res.status(200).json({
			ok: true,
			msg: `Se ha ingresado con exito los siguientes productos  ${parseGuardados}`,
		});
	} else {
		res.status(200).json({
			ok: true,
			msg: `Los productos ingresados ya existen en el sistema ${parseDuplicados}`,
		});
	}
};

const updatepanelPruebas = async (req, res) => {
	const { id } = req.body;

	console.log(req.body);

	const listapruebas = await Panel_pruebas.findByPk(id);
	if (!listapruebas) {
		return res
			.status(400)
			.json({ ok: false, msg: `La prueba con la ID ${id} no existe` });
	}


	const {
		CODIGO,
		ABREV,
		ORDEN,
		NOMBRE,
		muestraId,
		tecnicaId,
		modeloId,
		TIEMPO,
		VALOR,
		favorite,

		CODEXTERNO,
	} = req.body;
	const pruebas = await Panel_pruebas.findOne({ 
		where: { CODIGO: CODIGO } })
	if (pruebas) {
		return res
			.status(400)
			.json({ ok: false, msg: `el codigo  ${CODIGO} no existe` });
	}

	await Panel_pruebas.update(
		{
			CODIGO,
			ABREV,
			ORDEN,
			NOMBRE,
			muestraId,
			tecnicaId,
			modeloId,
			TIEMPO,
			VALOR,
			//favorite,

			//CODEXTERNO,
		},
		{ where: { id: id } }
	);
	res
		.status(200)
		.json({ ok: true, msg: `Se actualizo la prueba ${NOMBRE} con exito` });
	/* } else {
		await Panel_pruebas.update(
			{
				favorite,
			},
			{ where: { id: id } }
		);
		res
			.status(200)
			.json({ ok: true, msg: `Se actualizo la prueba ${NOMBRE} con exito` });
	} */
};
const updateFavoriteField = async (req, res) => {
	const { id } = req.body;
	const favorite = req.body.favorite;

	const favorites = await Panel_pruebas.findByPk(id);
	if (!favorites) {
		return res
			.status(400)
			.json({ ok: false, msg: `La prueba con la ID ${id} no existe` });
	}
	await favorites.update({ favorite: favorite });

	res.status(200).json({
		msg: "La prueba a sido agregado a favorito con exito...",
	});
};
const deletepanelPruebas = async (req, res) => {
	const { id } = req.params;
	console.log(id);
	const prueba = await Panel_pruebas.findByPk(id);
	if (!prueba) {
		return res
			.status(400)
			.json({ ok: false, msg: `La prueba con la ID ${id} no existe` });
	}
	await prueba.update({ ESTADO: 0 });

	res.status(200).json({
		msg: "La prueba  a sido desactivado con exito...",
	});
};

module.exports = {
	createpanelPruebas,
	updatepanelPruebas,
	deletepanelPruebas,
	getIdpruebas,
	getpanelPruebas,
	updateFavoriteField,
	cargaexcelPanelpruebas,
};
