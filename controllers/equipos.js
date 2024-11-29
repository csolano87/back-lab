const { Request, Response } = require("express");

const Equipos = require("../models/equipos");
const Modelo = require("../models/modelo");
const Marca = require("../models/marca");
const Ubicacion = require("../models/ubicacion");
const Estado = require("../models/estado");
const moment = require('moment');
const Accesorio = require("../models/accesorio");
const Equipocomplementario = require("../models/equiposcomplementarios");
const { sequelize } = require("../models/equipos");
const Analizador = require("../models/analizador");
const Estadofinancierocliente = require("../models/estadofinancierocliente");
const Estadofinancieroproveedor = require("../models/estadofinancieroproveedor");
const Usuario = require("../models/usuarios");
const Historicoubicacion = require("../models/historicoubicacion");
const Historicoestado = require("../models/historicoestado");
const { Op } = require("sequelize");
const getEquipos = async (req, res) => {
	const equipos = await Equipos.findAll({
		include: [
			{ model: Analizador, as: "instrumento" },
			{
				model: Modelo,
				as: "modelo",
			},
			{
				model: Marca,
				as: "marca",
			},
			{
				model: Historicoubicacion,
				as: "historicoubicacion",
				order: [["fecha", "DESC"]],
				limit: 1,
				include: {
					model: Ubicacion,
					as: "ubicacion",
				},
			},
			{
				model: Historicoestado,
				as: "historicoestado",

				order: [["fecha", "DESC"]],
				limit: 1,
				include: {
					model: Estado,
					as: "estado",
				},
			},
			{
				model: Estadofinancierocliente,
				as: "estadocliente",
			},
			{
				model: Estadofinancieroproveedor,
				as: "estadoproveedor",
			},
			{
				model: Accesorio,
				as: "acc",
				include: {
					model: Equipocomplementario,
					as: "equipocomplementarios",
				},
			},
			{
				model: Usuario,
				as: "usuario",
			},
		],
		order: [
			['id', 'DESC']
		]
	});



	res.status(200).json({ ok: true, equipos: equipos });
};

const GetIdEquipos = async (req, res) => {
	const { id } = req.params;
	const equipoId = await Equipos.findByPk(id, {
		include: [
			{ model: Analizador, as: "instrumento" },
			{
				model: Modelo,
				as: "modelo",
			},
			{
				model: Marca,
				as: "marca",
			},
			{
				model: Historicoubicacion,
				as: "historicoubicacion",
				order: [["fecha", "DESC"]],
				limit: 1,
				include: {
					model: Ubicacion,
					as: "ubicacion",
				},
			},
			{
				model: Historicoestado,
				as: "historicoestado",
				order: [["fecha", "DESC"]],
				limit: 1,
				include: {
					model: Estado,
					as: "estado",
				},
			},
			{
				model: Estadofinancierocliente,
				as: "estadocliente",
			},
			{
				model: Estadofinancieroproveedor,
				as: "estadoproveedor",
			},
			{
				model: Accesorio,
				as: "acc",
				include: {
					model: Equipocomplementario,
					as: "equipocomplementarios",
				},
			},
			{
				model: Usuario,
				as: "usuario",
			},
		],
	});

	if (!equipoId) {
		return res.status(400).json({
			ok: false,
			msg: `El id ${id} no existe`,
		});
	}
	res.status(200).json({
		ok: true,
		equipoId,
	});
};

const GetfiltroEquipo = async (req, res) => {
	const { marca, equipo, modelo, ubicacion, serie } = req.query;
	console.log(req.query)
	let where = {};
	if (marca) {
		where.marcaId = {
			[Op.eq]: marca
		};
	}

	if (equipo) {
		where.analizadorId = {
			[Op.eq]: equipo
		};
	}

	if (modelo) {
		where.modeloId = {
			[Op.eq]: modelo
		};
	}
    if (serie) {
		where.serie = {
			[Op.eq]: serie
		};
	}
/* 	if (ubicacion) {
		where.ubicacionId = {
			[Op.eq]: ubicacion
		};
	} */

	const equipos = await Equipos.findAll({
		where,
		include: [
			{ model: Analizador, as: "instrumento" },
			{
				model: Modelo,
				as: "modelo",
			},
			{
				model: Marca,
				as: "marca",
			},
			{
				model: Historicoubicacion,
				as: "historicoubicacion",
				where: ubicacion ? { ubicacionId: { [Op.eq]: ubicacion } } : {}, 
				order: [["fecha", "DESC"]],
				//where: ubicacion ? { ubicacionId: { [Op.eq]: ubicacion } } : undefined,
				
				limit: 1,
				include: {
					model: Ubicacion,
					as: "ubicacion",
				},
			},
			{
				model: Historicoestado,
				as: "historicoestado",

				order: [["fecha", "DESC"]],
				limit: 1,
				include: {
					model: Estado,
					as: "estado",
				},
			},
			{
				model: Estadofinancierocliente,
				as: "estadocliente",
			},
			{
				model: Estadofinancieroproveedor,
				as: "estadoproveedor",
			},
			{
				model: Accesorio,
				as: "acc",
				include: {
					model: Equipocomplementario,
					as: "equipocomplementarios",
				},
			},
			{
				model: Usuario,
				as: "usuario",
			},
		],
	});

	res.status(200).json({ ok: true, equipos });
};

const createEquipos = async (req, res) => {
	console.log(req.body);
	const user = req.usuario;
	const {
		//NOMBRE,
		analizadorId,
		fecha,
		CATEGORIA,
		marcaId,
		ESTADO_ID,
		UBICACION_ID,
		modeloId,
		SERIE,
		ESTADOPROVEEDOR,
		ESTADOCLIENTE,

		ACC,
	} = req.body;

	console.log(req.body);

	const t = await Equipos.sequelize.transaction();

	try {
		// Verifica si la serie ya existe
		const serieExiste = await Equipos.findOne({
			where: { SERIE: SERIE },
			transaction: t,
		});

		if (serieExiste) {
			await t.rollback();
			return res
				.status(200)
				.json({ ok: false, msg: `La serie ${SERIE} ya existe` });
		}

		const nuevoEquipo = await Equipos.create(
			{
				analizadorId: analizadorId,
				instrumentoId: analizadorId,
				fecha,
				modeloId,
				marcaId,
				//estadoId: ESTADO_ID,
				//ubicacionId: UBICACION_ID,
				SERIE,
				estadoproveedorId: ESTADOPROVEEDOR,
				estadoclienteId: ESTADOCLIENTE,
				CREATEDBY: user.id,
				usuarioId: user.id,
			},
			{ transaction: t }
		);

		await Historicoubicacion.create(
			{
				equipoId: nuevoEquipo.id,
				equiposId: nuevoEquipo.id,
				ubicacionId: UBICACION_ID,
				//historicoubicacionId: UBICACION_ID,
			},
			{ transaction: t }
		);

		await Historicoestado.create(
			{
				equipoId: nuevoEquipo.id,
				equiposId: nuevoEquipo.id,
				estadoId: ESTADO_ID,
				//historicoestadoId: ESTADO_ID,
			},
			{ transaction: t }
		);

		for (const accesorio of ACC) {
			accesorio.equipoId = nuevoEquipo.id; // Asocia el accesorio con el equipo
		}
		ACC.forEach(item => {
			item.fechacom = item.fechacom && moment(item.fechacom).isValid() ? item.fechacom : null;
		});
		await Accesorio.bulkCreate(ACC, { transaction: t });

		// Confirma la transacción
		await t.commit();
		return res
			.status(201)
			.json({ ok: true, msg: `El equipo ha  registrado con exito` });
	} catch (error) {
		console.log(error);
		// Rechaza la transacción en caso de error
		await t.rollback();
		console.log(error);
		return res
			.status(500)
			.json({ ok: false, msg: "Error al crear el equipo", error });
	}
};

const updateEquipos = async (req, res) => {
	const { id } = req.params;
	//console.log(req.body);
	const {
		analizadorId,
		CATEGORIA,
		fecha,
		MARCA_ID,
		ESTADO_ID,
		UBICACION_ID,
		MODELO_ID,
		SERIE,
		ESTADOPROVEEDOR,
		ESTADOCLIENTE,

		ACC,
	} = req.body;

	//console.log(req.body);

	await sequelize.transaction(async (t) => {
		try {
			const equipo = await Equipos.findByPk(id, {
				include: {
					model: Accesorio,
					as: "acc",
				},
				transaction: t,
			});
			/* if (!equipo) {
				return res
					.status(400)
					.json({ ok: false, msg: `La ID ${id} no existe` });
			} */

			await Equipos.update(
				{
					analizadorId: analizadorId,
					instrumentoId: analizadorId,
					modeloId: CATEGORIA,
					marcaId: MARCA_ID,
					//estadoId: ESTADO_ID,
					//ubicacionId: UBICACION_ID,
					fecha,
					SERIE,
					estadoproveedorId: ESTADOPROVEEDOR,
					estadoclienteId: ESTADOCLIENTE,
				},
				{ where: { id: id }, transaction: t }
			);
			await Historicoubicacion.create(
				{
					equipoId: id,
					equiposId: id,
					ubicacionId: UBICACION_ID,
					//historicoubicacionId: UBICACION_ID,
				},
				{ transaction: t }
			);

			await Historicoestado.create(
				{
					equipoId: id,
					equiposId: id,
					estadoId: ESTADO_ID,
					//historicoestadoId: ESTADO_ID,
				},
				{ transaction: t }
			);

			// Accesorios actuales del equipo
			const accesoriosExistentes = equipo.acc.map((a) => a.id);
			console.log(`accesoriosExistentes`, accesoriosExistentes);
			// Accesorios que vienen en la solicitud
			const nuevosAccesoriosIds = ACC.map((a) => a.equipocomplementariosId);

			// 1. Eliminar accesorios que ya no están en la lista ACC
			const accesoriosParaEliminar = accesoriosExistentes.filter(
				(id) => !nuevosAccesoriosIds.includes(id)
			);
			await Accesorio.destroy({
				where: {
					id: accesoriosParaEliminar,
					equipoId: id,
				},
				transaction: t,
			});

			// 2. Actualizar o agregar nuevos accesorios
			await Promise.all(
				ACC.map(async (item) => {
					const { DESCRIPCION, fechacom, equipocomplementariosId, SERIEACC, MARCA } =
						item;

					// Si el accesorio ya existe, actualízalo
					const accesorioExistente = await Accesorio.findOne({
						where: {
							equipocomplementariosId,
							equipoId: id,
						},
						transaction: t,
					});

					if (accesorioExistente) {
						await accesorioExistente.update(
							{
								DESCRIPCION,
								SERIEACC,
								MARCA,
								//fechacom: fechacom ? fechacom : null,
								fechacom: fechacom && moment(fechacom).isValid() ? fechacom : null,
							},
							{ transaction: t }
						);
						res.status(200).json({
							msg: `Se actualizo el equipo   con exito`,
						});
					} else {
						// Si no existe, crea un nuevo accesorio
						await Accesorio.create(
							{
								DESCRIPCION,
								equipocomplementariosId,
								SERIEACC,
								MARCA,
								//fechacom: fechacom ? fechacom : null,
								fechacom: fechacom && moment(fechacom).isValid() ? fechacom : null,
								equipoId: id,
							},
							{ transaction: t }
						);
					}
				})
			);
			res.status(200).json({
				msg: `Se actualizo el equipo   con exito`,
			});
		} catch (error) {
			res.status(500).json({
				ok: false,
				msg: error,
			});
		}
	});

	//res.send("update guardada con exito..");
};

const deleteEquipos = async (req, res) => {
	const { id } = req.params;
	const equipo = await Equipos.findByPk(id);
	if (!equipo) {
		return res.status(404).json({
			msg: `No existe el equipo con el id ${id}`,
		});
	}

	await equipo.update({ ESTADO: 0 });

	res.status(200).json({
		msg: "El equipo a sido desactivado con exito...",
	});
};

module.exports = {
	createEquipos,
	GetIdEquipos,
	updateEquipos,
	deleteEquipos,
	GetfiltroEquipo,
	getEquipos,
};
