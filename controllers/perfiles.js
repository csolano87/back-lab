const { Request, Response } = require("express");
const { sequelize } = require("../models/perfiles");
const Perfil = require("../models/perfiles");
const Itemprueba = require("../models/itemPruebas");
const Panel_pruebas = require("../models/panelPruebas");
const { includes } = require("lodash");
const Modelo = require("../models/modelo");
const Muestra = require("../models/muestras");
const Tecnica = require("../models/tecnica");

const getPerfiles = async (req, res) => {
	const listaperfiles = await Perfil.findAll({
		include: {
			model: Itemprueba,
			as: "itempruebas",
			include: {
				model: Panel_pruebas,
				as: "panelprueba",
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
			},
		},
	});

	res.json({ ok: true, listaperfiles });
};

const getIdperfiles = async (req, res) => {
	const { id } = req.params;

	console.log(id);

	const listaperfilesId = await Perfil.findByPk(id, {
		include: {
			model: Itemprueba,
			as: "itempruebas",
			include: {
				model: Panel_pruebas,
				as: "panelprueba",
			},
		},
	});
	if (!listaperfilesId) {
		return res
			.status(400)
			.json({ ok: false, msg: `La prueba con la ID ${id} no existe` });
	}
	res.status(200).json({ ok: true, listaperfilesId });
};
const createPerfiles = async (req, res) => {
	const { codigo, nombre, tipogrupoId, pruebas } = req.body;

	await sequelize.transaction(async (t) => {
		const perfil = await Perfil.create(
			{ codigo, nombre, tipogrupo: tipogrupoId },
			{ transaction: t }
		);

		const itempruebas = await Promise.all(
			pruebas.map(async (item) => {
				const pruebaId = item.pruebaId;
				return await Itemprueba.create(
					{
						perfilId: pruebaId,
						//panelpruebaId: pruebaId,
						itempruebaId: pruebaId,
					},
					{ transaction: t }
				);
			})
		);

		await perfil.setItempruebas(itempruebas, { transaction: t });
	});
	res.status(201).json({ msg: "La prueba  ha  registrado con exito" });
};

const updatePerfiles = async (req, res) => {
	const { id } = req.params;

	console.log(`----ID--->`, id);
	const { codigo, nombre, tipogrupoId, pruebas } = req.body;
	console.log(req.body);

	const listaperfiles = await Perfil.findByPk(id, {
		include: {
			model: Itemprueba,
			as: "itempruebas",
			include: {
				model: Panel_pruebas,
				as: "panelprueba",
			},
		},
	});
	if (!listaperfiles) {
		return res
			.status(400)
			.json({ ok: false, msg: `La prueba con la ID ${id} no existe` });
	}
	await sequelize.transaction(async (t) => {
		try {
			await Perfil.update(
				{
					nombre,
					tipogrupoId,
				},
				{ where: { id: id }, transaction: t }
			);

			//Pruebas actuales del perfil
			const pruebasExistentes = listaperfiles.itempruebas.map(
				(item) => item.itempruebaId
			);
			console.log("--->pruebasExistentes", pruebasExistentes);
			const nuevasPruebasIds = pruebas.map((item) => item.pruebaId);
			console.log("--->nuevasPruebasIds", nuevasPruebasIds);
			const pruebasParaEliminar = pruebasExistentes.filter(
				(id) => !nuevasPruebasIds.includes(id)
			);
			console.log("--->pruebasParaEliminar", pruebasParaEliminar);
			 await Itemprueba.destroy({
				where: {
					itempruebaId: pruebasParaEliminar,
					perfilId: id,
				},
				transaction: t,
			}); 

			//actualiza

			await Promise.all(
				pruebas.map(async (item) => {
					const { pruebaId, codigo, nombre } = item;
					const pruebasExistente = await Itemprueba.findOne({
						where: {
							itempruebaId: pruebaId,
							perfilId: id,
						},
						transaction: t,
					});

					if (!pruebasExistente) {
						await Itemprueba.create(
							{
								perfilId: id,
								itempruebaId: pruebaId,
							},
							{
								transaction: t,
							}
						);
					}
				})
			);
			res.status(200).json({
				msg: `Se actualizo el perfil   con exito`,
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({
				ok: false,
				msg: error,
			});
		}
	});
	//const { CODIGO, NOMBRE, CATEGORIA, TIEMPO, VALOR, favorite } = req.body;

	/* 	if (!favorite) {
		await Perfil.update(
			{
				CODIGO,
				NOMBRE,
				CATEGORIA,
				TIEMPO,
				VALOR,
			},
			{ where: { id: id } }
		);
		res
			.status(200)
			.json({ ok: true, msg: `Se actualizo la prueba ${NOMBRE} con exito` });
	} else {
		await Perfil.update(
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

const deletePerfiles = async (req, res) => {
	const { id } = req.params;
	console.log(id);
	const perfil = await Perfil.findByPk(id);
	if (!perfil) {
		return res
			.status(400)
			.json({ ok: false, msg: `La prueba con la ID ${id} no existe` });
	}
	await perfil.update({ estado: 0 });

	res.status(200).json({
		msg: "La prueba  a sido desactivado con exito...",
	});
};

module.exports = {
	createPerfiles,
	updatePerfiles,
	deletePerfiles,
	getIdperfiles,
	getPerfiles,
};
