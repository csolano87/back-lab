const Orden = require("../models/ordenes");
const Prueba = require("../models/pruebas");
const { Mutex } = require("async-mutex");
const { sequelize } = require("../models/ordenes");
const moment = require("moment");
const { Model, Op } = require("sequelize");
const Diagnostico = require("../models/diagnostico");
const Tipoatencion = require("../models/Tipoatencion");
const Tiposervicio = require("../models/tiposervicio");
const Paciente = require("../models/paciente");
const Medico = require("../models/medico");
const Panel_pruebas = require("../models/panelPruebas");
const { includes } = require("lodash");
const Rango = require("../models/rangosreferencia");
const Unidadedad = require("../models/unidadedad");
const Unidad = require("../models/unidad");
const Modelo = require("../models/modelo");
const Muestra = require("../models/muestras");
const Tecnica = require("../models/tecnica");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const bwipjs = require("bwip-js");
const { print } = require("pdf-to-printer");
const hisMutex = new Mutex();
const doc = new PDFDocument();

const net = require("net");

const printerIp = "192.168.1.150";
const printerPort = 9100;

const escpos = require("escpos");
const { waitForDebugger } = require("inspector");
const Usuario = require("../models/usuarios");
const Historicorden = require("../models/historicorden");
escpos.Network = require("escpos-network");
const getIngresorden = async (req, res) => {
	const ordenes = await Orden.findAll({
		order: [["numeroorden", "DESC"]],
		include: [
			{
				model: Diagnostico,
				as: "diagnostico",
			},
			{
				model: Tipoatencion,
				as: "tipoatencion",
			},
			{
				model: Tiposervicio,
				as: "tiposervicio",
			},
			{
				model: Prueba,
				as: "prueba",
				include: {
					model: Panel_pruebas,
					as: "panelprueba",
					/* include:{
						model:Rango,
						as:"rango"
					} */
				},
			},
			{
				model: Paciente,
				as: "paciente",
			},
			{
				model: Medico,
				as: "medico",
			},
		],
	});

	res.status(200).json({ ok: true, ordenes });
};

const getIdIngresorden = async (req, res) => {
	const { id } = req.params;
	const ordenId = await Orden.findByPk(id, {
		include: [
			{
				model: Diagnostico,
				as: "diagnostico",
			},
			{
				model: Tipoatencion,
				as: "tipoatencion",
			},
			{
				model: Tiposervicio,
				as: "tiposervicio",
			},
			{
				model: Prueba,
				as: "prueba",
				include: [{
					model: Panel_pruebas,
					as: "panelprueba",
					include: [
						{
							model: Rango,
							as: "rango",
							include: [
								{
									model: Unidadedad,
									as: "unidadedad",
								},
								{
									model: Unidad,
									as: "unidad",
								},
							],
						},
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
				{ model: Usuario, as: 'creador', },
				{ model: Usuario, as: 'reportador', },
				{ model: Usuario, as: 'validador', }
				],

			},

			{
				model: Paciente,
				as: "paciente",
			},
			{
				model: Medico,
				as: "medico",
			},
		],
	});

	res.status(200).json({ ok: true, ordenId });
};
const postIngresorden = async (req, res) => {
	const user = req.usuario;

	moment.locale("es");
	const hoy = moment();
	const fechaetq = hoy.format().slice(2, 10);
	const fecha = hoy.format().slice(2, 10).replaceAll("-", "");
	const fechaH = hoy.format().slice(0, 10).replaceAll("-", "");

	const fechaT = hoy.format("L").split("/");
	const fechaToma = fechaT[2] + "-" + fechaT[1] + "-" + fechaT[0];
	const horaToma = hoy.format("LTS");

	let Norden = 0;

	const releaseHisMutex = await hisMutex.acquire();
	try {
		const numeroOrdenBD = await Orden.findAll({
			attributes: ["numeroorden"],
			limit: 1,
			order: [["numeroorden", "DESC"]],
		});

		if (numeroOrdenBD) {
			let numero = parseInt(
				`${numeroOrdenBD[0].dataValues.numeroorden}`.slice(-4)
			);

			const rest =
				fecha - `${numeroOrdenBD[0].dataValues.numeroroden}`.slice(0, 6);
			if (isNaN(numero) || rest > 0) {
				let num = 0;
				Norden = `${num + 1}`.padStart(4, "0");
			} else {
				Norden = `${numero + 1}`.padStart(4, "0");
			}
		} else {
			let num = 0;
			Norden = `${num + 1}`.padStart(4, "0");
		}

		await sequelize.transaction(async (t) => {
			const {
				pacienteId,

				tipoatencionId,
				tiposervicioId,
				medicoId,
				embarazada,
				fum,
				diagnosticoId,
				observaciones,
				pruebas,
				//usuarioId = user.id,
			} = req.body;

			const ordenes = await Orden.create(
				{
					pacienteId,
					numeroorden: fecha + Norden,
					tipoatencionId,
					tiposervicioId,
					medicoId,
					embarazada,
					fum: fum && moment(fum).isValid() ? fum : null,
					diagnosticoId,
					observaciones,
					usuarioId: user.id,
				},
				{ transaction: t }
			);

			const prueba = await Promise.all(
				pruebas.map(async (item) => {
					return await Prueba.create(
						{
							panelpruebaId: item.codigoId,
							estado: item.estado,
							//ordenId: id,
						},
						{ transaction: t }
					);
				})
			);
			await ordenes.setPrueba(prueba, { transaction: t });


			const datapersonales = await Paciente.findByPk(pacienteId);

			res.status(201).json({
				msg: `Se a integrado  la orden # ${fecha + Norden} para el paciente ${datapersonales.dataValues.apellidos
					} ${datapersonales.dataValues.nombres} `,
			});
			for (const item of pruebas) {

				await Historicorden.create({
					accion: 'creado',
					detalles: 'Se creo la orden',
					ordenId: ordenes.id,
					usuarioId: user.id,
					pruebaId: item.codigoId
				}, { transaction: t })
				console.info(item);
				/* ^FO250,40^A0N,5,5^FDEtiqueta de Laboratorio^FS */
				if (item.etq === 3 || item.etq === null || item.etq === "null") {
					const zpl = `
					^XA				
					^FO270,20^A0N,15,15^FD${datapersonales.dataValues.apellidos}, ${datapersonales.dataValues.nombres}^FS
					^FO270,40^A0N,15,15^FDSexo:${datapersonales.dataValues.sexo} Edad: ${datapersonales.dataValues.edad} C:${item.nomExam}^FS
					
					^FO270,60^BY2^BCN,100,Y,N,N^FD${ordenes.dataValues.numeroorden}^FS
					^FO270,200^A0N,15,15^FD${item.muestra} ${fechaetq}^FS
					^XZ
					`;
					//item.muestra
					// Crear una conexión con la impresora
					const client = new net.Socket();
					client.connect(printerPort, printerIp, () => {
						client.write(zpl); // Enviar los comandos ZPL
						client.end(); // Finalizar la conexión
					});

					client.on("error", (err) => {
						console.error("Error al conectar con la impresora:", err);
					});
				}
			}


		});
	} catch (error) {
		console.log(`*****************ERROR*************`, error);
	} finally {
		releaseHisMutex();
	}
};
const updateIngresorden = async (req, res) => {
	const hoy = moment();
	//const hora = ;
	const [fecha, hora] = hoy.format("LTS");
	console.log(`**************************************************`, hora, fecha)
	const user = req.usuario;
	const { id } = req.params;
	const ordenes = req.body;
	console.log(ordenes);
	const {
		pacienteId,
		numero,
		tipoatencionId,
		tiposervicioId,
		medicoId,
		doctor,
		embarazada,
		fum,
		diagnostico,
		diagnosticoId,
		observaciones,
		pruebas,
	} = ordenes;
	const orden = await Orden.findByPk(id, {
		include: { model: Prueba, as: "prueba" },
	});

	if (!orden) {
		return res.status(404).json({
			ok: false,
			msg: `La orden con id ${id} no existe`,
		});
	}
	await sequelize.transaction(async (t) => {
		try {
			await Orden.update(
				{
					pacienteId,

					tipoatencionId,
					tiposervicioId,
					medicoId,
					embarazada,
					fum: fum && moment(fum).isValid() ? fum : null,
					diagnosticoId,
					observaciones,
					usuarioId: user.id,
				},
				{ where: { id: id }, transaction: t }
			);

			const examExistente = orden.prueba.map((item) => item.panelpruebaId);
			const examNuevos = pruebas.map((item) => item.codigoId);
			const pruebasEliminar = examExistente.filter(
				(id) => !examNuevos.includes(id)
			);
			await Prueba.destroy({
				where: {
					ordenId: id,

					panelpruebaId: pruebasEliminar,
				},
			});
			await Historicorden.create({
				accion: 'Eliminar',
				detalles: 'Se elimino la orden',
				ordenId: id,
				usuarioId: user.id,
				pruebaId: pruebasEliminar
			})

			await Promise.all(
				pruebas.map(async (item) => {
					const { codigoId, codigo, nomExam, tiempo, muestra, etq, estado } =
						item;

					const examExistente = await Prueba.findOne({
						where: {
							ordenId: id,

							panelpruebaId: codigoId,
						},
					});

					if (!examExistente) {

						await Prueba.create(
							{
								ordenId: id,
								estado: estado,

								panelpruebaId: codigoId,
								creadorId: user.id,


							},
							{ transaction: t }
						);


						await Historicorden.create({
							accion: 'creado',
							detalles: 'Se creo la orden',
							ordenId: id,
							usuarioId: user.id,
							pruebaId: codigoId
						}, { transaction: t })
						console.log(examExistente);


					} else if (examExistente.estado === 2) {
						await examExistente.update(
							{
								//ordenId: id,
								estado: estado,
								fechaorden: fecha,
								horaorden: hora,
								reportadaId: user.id,
								fechaordenreportada: fecha,
								horaordenreportada: hora


							},
							{ transaction: t }
						);

						await Historicorden.create({
							accion: 'actualizar',
							detalles: 'Se actualizo la orden',
							ordenId: id,
							usuarioId: user.id,
							pruebaId: codigoId
						}, { transaction: t })
					}
				})
			);
			res.status(200).json({
				msg: `Se actualizo las pruebas   con exito`,
			});
		} catch (error) {
			console.log(error);
		}
	});
};
const validarIngresorden = async (req, res) => {
	const hoy = moment();
	//const hora = ;
	const [fecha, hora] = hoy.format("LTS");
	console.log(`**************************************************`, hora, fecha)
	const { id } = req.params;
	console.log(req.body)
	const user = req.usuario;

	if (!req.body.panelpruebaId) {
		const { estado } = req.body;
		const orden = await Orden.findByPk(id);
		if (!orden) {
			return res.status(404).json({
				ok: false,
				msg: `La orden con ID ${id} no existe`,
			});
		}

		await orden.update({
			estado: estado,
			validadaId: user.id,
			fechaordenvalidada: fecha,
			horaordenvalidada: hora
		});
		const ordenes = await Orden.findByPk(id, {
			include: {
				model: Prueba,
				as: "prueba",
			}
		});

		const validarEstadoOrden = ordenes.prueba.some(item => item.estado === 2);
		if (validarEstadoOrden) {
			return res.status(200).json({ ok: true, msg: `Se valido la orden correctamente` });
		}
		await ordenes.update({ estado: 3 })
		res.status(200).json({ ok: true, msg: `Se valido la orden correctamente` });

	} else {
		try {
			for (const e of req.body.panelpruebaId) {
				await Prueba.update(
					{
						estado: req.body.estado,
						validadaId: user.id,
						fechaordenvalidada: fecha,
						horaordenvalidada: hora
					},
					{
						where: {
							ordenId: id,
							panelpruebaId: e
						}
					}
				);


			}
			const ordenes = await Orden.findByPk(id, {
				include: {
					model: Prueba,
					as: "prueba",
				}
			});
			console.log(ordenes)
			const validarEstadoOrden = ordenes.prueba.some(item => item.estado === 2);
			if (validarEstadoOrden) {
				return res.status(200).json({ ok: true, msg: `Se valido la orden correctamente` });
			}
			await ordenes.update({ estado: 3 })
			res.status(200).json({ ok: true, msg: `Se valido la orden correctamente` });


		} catch (error) {
			console.error("Error actualizando la orden:", error);
			res.status(500).json({ ok: false, msg: "Error al validar la orden" });
		}
	}

};
const deleteIngresorden = async (req, res) => {
	const { id } = req.params;
	const orden = await Orden.findByPk(id);
	if (!orden) {
		return res.status(404).json({
			ok: false,
			msg: `La orden con id ${id} no existe`,
		});
	}
	console.log(orden);
	await orden.update({ estado: 0 });
	res.status(200).json({
		ok: true,
		msg: `La orden ${orden.dataValues.numeroorden} a sido eliminada`,
	});
};


const getFiltrosIngresorden = async (req, res) => {
	const { orden, identificacion, modeloId, fechaIn, fechaOut } = req.query;
	console.log(req.query);
	/* let where = {};

	if (orden) {

		where.numeroorden = {
			[Op.eq]: orden,
		}

	} */




	const data = await Orden.findAll({
		where: {
			...(orden ? {
				numeroorden: orden

			} : {}),
			...(fechaIn && fechaIn ?
				{ fechaorden: { [Op.between]: [fechaIn, fechaIn] } } : {})
		},
		include: [
			{
				model: Diagnostico,
				as: "diagnostico",
			},
			{
				model: Tipoatencion,
				as: "tipoatencion",
			},
			{
				model: Tiposervicio,
				as: "tiposervicio",
			},
			{
				model: Prueba,
				as: "prueba",
				required: true,

				include: {
					model: Panel_pruebas,
					as: "panelprueba",
					required: true,
					include: [
						{
							model: Rango,
							as: "rango",
							include: [
								{
									model: Unidadedad,
									as: "unidadedad",
								},
								{
									model: Unidad,
									as: "unidad",
								},
							],
						},
						{
							model: Modelo,
							as: "modelo",
							where: modeloId ? { id: modeloId } : {},
							required: true,
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
			{
				model: Paciente,
				as: "paciente",
				where:
					identificacion ? { numero: identificacion } : {}

			},
			{
				model: Medico,
				as: "medico",
			},
		],
	})
	res.status(200).json({
		ok: true,
		ordenes: data
	})

}

module.exports = {
	getIngresorden,
	getIdIngresorden,
	postIngresorden,
	updateIngresorden,
	deleteIngresorden,
	validarIngresorden,
	getFiltrosIngresorden
};
