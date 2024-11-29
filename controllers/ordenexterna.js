const { Request, Response } = require("express");
const { Op, and, Sequelize } = require("sequelize");
const fs = require("fs");
const moment = require("moment");
const bcryptjs = require("bcryptjs");
const { Mutex } = require("async-mutex");

const path = require("path");
const { where } = require("sequelize");
const { sequelize } = require("../models/cabecera");
const db = require("../db/connection");
const Usuario = require("../models/usuarios");
const Cabecera_Agen = require("../models/cabecera_agen");
const Detalle_Agen = require("../models/detalle_agen");
const Cabecera = require("../models/cabecera");
const Detalle = require("../models/detalle");
const Server = require("../models/server");
const salas = require("../json/origen");

const hisMutex = new Mutex();
const out_dir = String.raw`C:\Users\DESARROLLLO\Videos`;

const ordenexternaGet = async (req, res) => {
	const server = Server.instance;

	const ordenes = await Cabecera.findAll({
		attributes: [
			"FECHA",
			[Sequelize.fn("COUNT", Sequelize.col("FECHA")), "count"],
		],
		group: ["FECHA"],
	});
	server.io.emit("orden-generada", ordenes);

	res.json({
		ok: true,
		ordenes: ordenes,
	});
};

const ordenexternaGetTodos = async (req, res) => {
	const consulta = await Cabecera.findAll({
		include: {
			model: Detalle,
			as: "pruebas",
		},
	});

	const orden = consulta.map((cabecera) => {
		let pruebasFiltradas;

		if (cabecera.ESTADO === 1) {
			pruebasFiltradas = cabecera.pruebas.filter(
				(prueba) => prueba.ESTADO === true
			);
		} else if (cabecera.ESTADO === 3) {
			pruebasFiltradas = cabecera.pruebas.filter(
				(prueba) => prueba.ESTADO == false
			);
		}

		return {
			...cabecera.dataValues,
			pruebas: pruebasFiltradas,
		};
	});

	/* orden.forEach((objeto) => {
		const Dta = objeto.dataValues.DLCPRO;

		if (Array.isArray(Dta)) {
			const listGroups = Dta.map((item) => {
				const referenciaObjeto = salas.find((ref) => ref.id === item);
				if (referenciaObjeto) {
					return referenciaObjeto.nombre;
				}
				return item;
			});
			objeto.dataValues.DLCPRO = listGroups;
		} else {
			const referenciaObjeto = salas.find((ref) => ref.id === Dta);
			if (referenciaObjeto) {
				objeto.dataValues.DLCPRO = referenciaObjeto.nombre;
			} else {
				objeto.dataValues.DLCPRO = Dta; // Mantén el valor original si no hay coincidencia
			}
		}
	});  */

	res.status(200).json({
		ok: true,
		ordenes: orden,
	});
};
const ordenexternaById = async (req, res) => {
	const id = req.params.id;
	const ordene = await Cabecera.findByPk(id, {
		include: {
			model: Detalle,
			as: "pruebas",
		},
	});
	let pruebasFiltradas = [];

	if (ordene.dataValues.ESTADO === 1) {
		pruebasFiltradas = ordene.dataValues.pruebas.filter(
			(prueba) => prueba.ESTADO === null
		);
	} else if (ordene.dataValues.ESTADO === 3) {
		pruebasFiltradas = ordene.dataValues.pruebas.filter(
			(prueba) => prueba.ESTADO === false
		);
	}

	const orden = {
		...ordene.dataValues,
		pruebas: pruebasFiltradas,
	};

	res.status(200).json({
		ok: true,
		ordenes: orden,
	});
};

const ordenesGetfiltroExterna = async (req, res) => {
	console.log("params", req.query);
	const { IDENTIFICADOR, NUMEROORDEN, ESTADO, HIS, FECHA, FECHAORDEN, SALA } =
		req.query;
	console.log("**********IDENTIFICADOR**********", IDENTIFICADOR);
	console.log("**********NUMEROORDEN**********", NUMEROORDEN);
	console.log("**********ESTADO**********", ESTADO);
	console.log("**********HIS**********", HIS);
	console.log("**********FECHACITA**********", FECHA);
	console.log("**********FECHAORDEN**********", FECHAORDEN);
	let where = {};
	if (IDENTIFICADOR) {
		where.DLCEDU = {
			[Op.eq]: IDENTIFICADOR,
		};
	}

	if (NUMEROORDEN) {
		where.NUMEROORDEN = {
			[Op.eq]: NUMEROORDEN,
		};
	}

	if (ESTADO) {
		where.ESTADO = {
			[Op.eq]: ESTADO,
		};
	}

	if (HIS) {
		where.HIS = {
			[Op.eq]: HIS,
		};
	}

	if (FECHA) {
		where.FECHA = {
			[Op.eq]: FECHA,
		};
	}

	if (FECHAORDEN) {
		where.FECHAORDEN = {
			[Op.eq]: FECHAORDEN,
		};
	}

	if (SALA) {
		where.DLNUOR = {
			[Op.eq]: SALA,
		};
	}

	const data = await Cabecera.findAll({ where });

	data.forEach((objeto) => {
		const Dta = objeto.dataValues.DLCPRO;

		if (Array.isArray(Dta)) {
			const listGroups = Dta.map((item) => {
				const referenciaObjeto = salas.find((ref) => ref.id === item);
				if (referenciaObjeto) {
					return referenciaObjeto.nombre;
				}
				return item;
			});
			objeto.dataValues.DLCPRO = listGroups;
		} else {
			const referenciaObjeto = salas.find((ref) => ref.id === Dta);
			if (referenciaObjeto) {
				objeto.dataValues.DLCPRO = referenciaObjeto.nombre;
			} else {
				objeto.dataValues.DLCPRO = Dta; // Mantén el valor original si no hay coincidencia
			}
		}
	});
	console.log(`**************`, data);
	res.status(200).json({ ok: true, resultados: data });
};
const ordenexternaPost = async (req, res) => {
	const User = req.usuario;
	const numExiste = await Cabecera.findOne({
		where: { DLNUOR: req.body.DLNUOR },
	});
	/* if (numExiste) {
	console.log(`La orden ${req.body.DLNUOR} ya se encuentra ingresada. `)
	return res.status(400).json({ok:false,msg:`La orden ${req.body.DLNUOR} ya se encuentra ingresada. `})
	
} */
	if (req.body.FECHA) {
		const totalAgendado = await Cabecera.count({
			where: { FECHA: req.body.FECHA },
		});

		if (totalAgendado == 4) {
			console.log(
				`No existe disponiblidad para agendar debe de seleccionar otra fecha`,
				totalAgendado
			);
			return res.status(400).json({
				ok: false,
				msg: `No hay disponibilidad en el agendamiento, seleccione otra fecha `,
			});
		}

		const server = Server.instance;
		const user = req.usuario;

		const {
			DLCBEN,
			DLCACT,
			DLCDEP,
			DLCOTR,
			DLCEDU,
			DLCPRO,
			DLCSER,
			DLCMED,
			DLCDIS,
			DLNUOR,
			DLAPEL,
			DLNOMB,

			DLSEXO,
			DLFECN,
			DLHIST,
			FECHA,
			DLTIDO,
		} = req.body;

		await Cabecera.create({
			DLCBEN,
			DLCACT,
			DLCDEP,
			DLCOTR,
			DLCEDU,
			DLCPRO,
			DLCSER,

			DLCMED,
			DLCDIS,
			DLNUOR,
			DLAPEL,
			DLNOMB,
			DLSEXO,
			DLFECN,
			DLHIST,
			FECHA: `${req.body.FECHA}` == "" ? null : FECHA,
			DLTIDO,
			USUARIO_ID: User.id,
		}).then((cabecera) => {
			Detalle.bulkCreate(req.body.DLCEXAS).then((ItemID) => {
				cabecera.setPruebas(ItemID);
			});
		});

		const ordenesActualizadas = await Cabecera.findAll({
			attributes: [
				"FECHA",
				[Sequelize.fn("COUNT", Sequelize.col("FECHA")), "count"],
			],
			group: ["FECHA"],
		});

		console.log(`************************`, ordenesActualizadas);
		server.io.emit("orden-generada", ordenesActualizadas);
		res.status(201).json({
			msg: `Se a creado exitosamente la orden # ${DLNUOR} para el paciente ${DLAPEL}  `,
		});
	} else {
		const user = req.usuario;

		const {
			DLCBEN,
			DLCACT,
			DLCDEP,
			DLCOTR,
			DLCEDU,
			DLCPRO,
			DLCSER,
			DLCMED,
			DLCDIS,
			DLNUOR,
			DLAPEL,
			DLNOMB,
			DLSEXO,
			DLFECN,
			DLHIST,
			FECHA,
			DLTIDO,
		} = req.body;
		console.log(req.body.DLCEXAS);
		await Cabecera.create({
			DLCBEN,
			DLCACT,
			DLCDEP,
			DLCOTR,
			DLCEDU,
			DLCPRO,
			DLCSER,
			DLCMED,
			DLCDIS,
			DLNUOR,
			DLAPEL,
			DLNOMB,
			DLSEXO,
			DLFECN,
			DLHIST,
			FECHA: `${req.body.FECHA}` == "" ? null : FECHA,
			DLTIDO,
			//CODIMPRESORA,
			//NUMEROORDEN,
			ESTADO: 2,
			USUARIO_ID: User.id,
		}).then((cabecera) => {
			Detalle.bulkCreate(req.body.DLCEXAS).then((ItemID) => {
				cabecera.setPruebas(ItemID);
			});
		});
		const filename = path.join(
			out_dir,
			`ORD_${DLNUOR}_${fecha}${horaToma2}.TXT`
		);
		const pruebas = req.body.DLCEXAS.filter((pru) => pru.ESTADO === true)
		.map((pru, i) => `OBR|${i + 1}|||${pru.ItemID}`)
			.join("\n");
		console.log(pruebas);

		let HL7 =
			`MSH|^~\&||IESS PORTOVIEJO|cobas Infinity|Roche Ecuador|${fecha}${horaToma2}||OML^O21^OML_O21|${fecha}${horaToma2}\n` +
			`PID|1|${req.body.DLCEDU}|846641|846641|${
				req.body.DLAPEL
			}^.||${req.body.DLFECN.replaceAll("-", "")}|${req.body.DLSEXO}||\n` +
			`PV1||1|^^|ROCHE^ROCHE|1^IESS PORTOVIEJO(LABORATORIO)|ZBR3^RECEPCION2|${req.body.DLCACT}|${req.body.DLCDEP}|${req.body.DLCOTR}|||||||||2208226258|${req.body.DLHIST}\n` +
			`ORC|NW||||||||${fecha}${horaToma2}|||${req.body.DLCMED}|${req.body.DLCPRO}|||${req.body.DLTIDO}|${req.body.DLCSER}\n` +
			`${pruebas}`;

		fs.writeFileSync(`${filename}`, HL7);
		res.status(201).json({
			msg: `Se a creado exitosamente la orden # ${DLNUOR} para el paciente ${DLAPEL}  `,
		});
	}
};
const ordenexternaUpdate = async (req, res) => {
	const id = req.params.id;
	server = Server.instance;
	const user = req.usuario;

	moment.locale("es");
	const hoy = moment();
	const fecha = hoy.format().slice(0, 10).replaceAll("-", "");

	const fechaT = hoy.format("L").split("/");
	const fechaToma = fechaT[2] + "-" + fechaT[1] + "-" + fechaT[0];
	let Norden = 0;
	const horaToma = hoy.format("LTS");
	const horaToma2 = hoy.format("LTS").replaceAll(":", "");
	console.log(`q`, horaToma2);

	/* 	const numeroOrdenBD = await Cabecera.findAll({
			attributes: ["NUMEROORDEN"],
			limit: 1,
			order: [["NUMEROORDEN", "DESC"]],
		});

		let numero = parseInt(
			`${numeroOrdenBD[0].dataValues.NUMEROORDEN}`.slice(-4)
		);
		const rest =
			fecha - `${numeroOrdenBD[0].dataValues.NUMEROORDEN}`.slice(0, 6);
		if (isNaN(numero) || rest > 0) {
			let num = 0;
			Norden = `${num + 1}`.padStart(4, "0");
		} else {
			Norden = `${numero + 1}`.padStart(4, "0");
		} */

	const { DLNUOR, CODIMPRESORA, ESTADO, DLCEXAS } = req.body;

	const valorEstadoPruebas = DLCEXAS.some((item) => item.ESTADO == false);
	console.log(`valor`, valorEstadoPruebas);
	if (valorEstadoPruebas === true) {
		await sequelize.transaction(async (t) => {
			try {
				const orden = await Cabecera.findByPk(id);
				if (!orden) {
					return res
						.status(400)
						.json({ ok: false, msg: `La orden ${DLNUOR} no existe` });
				}
				await Cabecera.update(
					{
						HORATOMA: horaToma,
						FECHATOMA: fechaToma,
						CODIMPRESORA,
						//NUMEROORDEN: fecha + Norden,
						ESTADO: 3,
					},
					{ where: { id: id }, transaction: t }
				);
				await Promise.all(
					DLCEXAS.map(async (item) => {
						const { ItemID, ItemName, ESTADO } = item;
						await Detalle.update(
							{
								ESTADO,
							},
							{
								where: { cabeceraId: id, ItemID: ItemID },
								transaction: t,
							}
						);
					})
				);
				const filename = path.join(
					out_dir,
					`ORD_${DLNUOR}_${fecha}${horaToma2}.TXT`
				);
				const pruebas = req.body.DLCEXAS.filter((pru) => pru.ESTADO === true)
					.map((pru, i) => `OBR|${i + 1}|||${pru.ItemID}`)
					.join("\n");
				console.log(pruebas);

				let HL7 =
					`MSH|^~\&||IESS PORTOVIEJO|cobas Infinity|Roche Ecuador|${fecha}${horaToma2}||OML^O21^OML_O21|${fecha}${horaToma2}\n` +
					`PID|1|${req.body.DLCEDU}|${req.body.DLHIST}|${req.body.DLHIST}|${
						req.body.DLAPEL
					}^.||${req.body.DLFECN.replaceAll("-", "")}|${req.body.DLSEXO}||\n` +
					`PV1||1|^^|ROCHE^ROCHE|1^IESS PORTOVIEJO(LABORATORIO)|ZBR3^RECEPCION2|${req.body.DLCACT}|${req.body.DLCDEP}|${req.body.DLCOTR}|||||||||2208226258|${req.body.DLHIST}\n` +
					`ORC|NW||||||||${fecha}${horaToma2}|||${req.body.DLCMED}|${req.body.DLCPRO}|||${req.body.DLTIDO}|${req.body.DLCSER}\n` +
					`${pruebas}`;

				fs.writeFileSync(`${filename}`, HL7);
				res.status(201).json({
					msg: `La orden  ${DLNUOR} se actualizo con exito`,
				});
			} catch (error) {
				console.log(error);
			}
		});
	} else {
		await sequelize.transaction(async (t) => {
			try {
				/* 	const orden = await Cabecera.findByPk(req.body.id);
				if (!orden) {
					return res
						.status(400)
						.json({ ok: false, msg: `La orden ${DLNUOR} no existe` });
				} */
				await Cabecera.update(
					{
						HORATOMA: horaToma,
						FECHATOMA: fechaToma,
						CODIMPRESORA,
						//NUMEROORDEN: fecha + Norden,
						ESTADO: 2,
					},
					{ where: { id: id }, transaction: t }
				);
				await Promise.all(
					DLCEXAS.map(async (item) => {
						const { ItemID, ItemName, ESTADO } = item;
						await Detalle.update(
							{
								ESTADO,
							},
							{
								where: { cabeceraId: id, ItemID: ItemID },
								transaction: t,
							}
						);
					})
				);
				/* const filename = path.join(
					out_dir,
					`ORD_${DLNUOR}_${fecha}${horaToma2}.TXT`
				);
				let HL7 =
					`MSH|^~\&||IESS PORTOVIEJO|cobas Infinity|Roche Ecuador|20220822072523||OML^O21^OML_O21|202208220725232916258\n`+
					`PID|1|1308096450|846641|846641|MENDOZA MACIAS DORIS MARICELA^.||19770405|F||\n`+
					`PV1||1|^^|ROCHE^ROCHE|1^IESS PORTOVIEJO(LABORATORIO)|ZBR3^RECEPCION2|1|9|9|||||||||2208226258|7928463\n`+
					`ORC|NW||||||||20220822072523|||17227648|9|||R|585\n`+
					`OBR|1|||340077\n`+
					`OBR|2|||360009\n`+
					`OBR|3|||360015\n`+
					`OBR|4|||360016\n`+
					`OBR|5|||360017\n`+
					`OBR|6|||360020\n`+
					`OBR|7|||360021\n`+
					`OBR|8|||360024\n`+
					`OBR|9|||360034\n`+
					`OBR|10|||36003\n`+
					`OBR|11|||36003\n`+
					`OBR|12|||36004\n`+
					`OBR|13|||36014\n`+
					`OBR|14|||380012`;
			
				fs.witeFileSync(`${filename}`, `${HL7}`); */
				const filename = path.join(
					out_dir,
					`ORD_${DLNUOR}_${fecha}${horaToma2}.TXT`
				);
				const pruebas = req.body.DLCEXAS.filter((pru) => pru.ESTADO === true)
					.map((pru, i) => `OBR|${i + 1}|||${pru.ItemID}`)
					.join("\n");
				console.log(pruebas);

				let HL7 =
					`MSH|^~\&||IESS PORTOVIEJO|cobas Infinity|Roche Ecuador|${fecha}${horaToma2}||OML^O21^OML_O21|${fecha}${horaToma2}\n` +
					`PID|1|${req.body.DLCEDU}|${req.body.DLHIST}|${req.body.DLHIST}|${
						req.body.DLAPEL
					}^.||${req.body.DLFECN.replaceAll("-", "")}|${req.body.DLSEXO}||\n` +
					`PV1||1|^^|ROCHE^ROCHE|1^IESS PORTOVIEJO(LABORATORIO)|ZBR3^RECEPCION2|${req.body.DLCACT}|${req.body.DLCDEP}|${req.body.DLCOTR}|||||||||2208226258|${req.body.DLHIST}\n` +
					`ORC|NW||||||||${fecha}${horaToma2}|||${req.body.DLCMED}|${req.body.DLCPRO}|||${req.body.DLTIDO}|${req.body.DLCSER}\n` +
					`${pruebas}`;

				fs.writeFileSync(`${filename}`, HL7);
				res.status(201).json({
					msg: `La orden  ${DLNUOR} se actualizo con exito`,
				});
			} catch (error) {
				console.log(error);
			}
		});
	}

	/*	const ordenActualizada = await Cabecera.findAll({
			include: {
				model: Detalle,
				as: "pruebas",
			},
		});

		ordenActualizada.forEach((objeto) => {
	 		const Dta = objeto.dataValues.DLCPRO;

			if (Array.isArray(Dta)) {
				const listGroups = Dta.map((item) => {
					const referenciaObjeto = salas.find((ref) => ref.id === item);
					if (referenciaObjeto) {
						return referenciaObjeto.nombre;
					}
					return item;
				});
				objeto.dataValues.DLCPRO = listGroups;
			} else {
				const referenciaObjeto = salas.find((ref) => ref.id === Dta);
				if (referenciaObjeto) {
					objeto.dataValues.DLCPRO = referenciaObjeto.nombre;
				} else {
					objeto.dataValues.DLCPRO = Dta; 
				}
			}
		}); */

	/* 	server.io.emit("numero-generado", ordenActualizada);
	
		const partesApel = req.body.DLAPEL.split(" ");

		const idw = req.body.pruebas
			.map(
				(e, i) =>
					`O|${i + 1}|${fecha}${Norden}|${e.ItemID}|${fecha}|${horaToma}`
			)
			.join("\n");

		const filename = path.join(out_dir, `${fecha + Norden}.ord`);
		const data =
			`H|^&|Roche^^Diagnostics|||OrderEntry^Interface||HPBO^^cobas_Infinity||||P|\n` +
			`P|1|${fecha}${Norden}|${req.body.DLCEDU}|${partesApel
				.slice(0, 2)
				.join(" ")}|${partesApel.slice(partesApel.length - 2).join(" ")}|${
				req.body.DLFECN
			}|${req.body.DLSEXO}|${req.body.DLCMED}|${req.body.DLTIDO}|${
				req.body.CODIMPRESORA
			}|${req.body.DLHIST}|${fecha}|${horaToma}\n` +
			`${idw}\n` +
			`L|1|F`;

	

		fs.writeFileSync(`${filename}`, data); */
};

const ordenexternaDelete = async (req, res) => {
	server = Server.instance;
	const { id } = req.params;
	console.log(id);
	const orden = await Cabecera.findByPk(id);
	if (!orden) {
		return res.status(404).json({
			msg: `No existe la orden  con el id ${id}`,
		});
	}
	if (orden.ESTADO === 2 || orden.ESTADO === 3) {
		return res.status(401).json({
			msg: `La orden con estado ingresado  no puede ser eliminada`,
		});
	}

	/* const ordenEliminada = await Cabecera.findAll({
include:{
	model:Detalle,
	as:'pruebas',
	
}
	}) */

	await orden.update({ ESTADO: 0 });

	const ordenEliminada = await Cabecera.findAll({
		include: {
			model: Detalle,
			as: "pruebas",
		},
	});

	ordenEliminada.forEach((objeto) => {
		const Dta = objeto.dataValues.DLCPRO;

		if (Array.isArray(Dta)) {
			const listGroups = Dta.map((item) => {
				const referenciaObjeto = salas.find((ref) => ref.id === item);
				if (referenciaObjeto) {
					return referenciaObjeto.nombre;
				}
				return item;
			});
			objeto.dataValues.DLCPRO = listGroups;
		} else {
			const referenciaObjeto = salas.find((ref) => ref.id === Dta);
			if (referenciaObjeto) {
				objeto.dataValues.DLCPRO = referenciaObjeto.nombre;
			} else {
				objeto.dataValues.DLCPRO = Dta; // Mantén el valor original si no hay coincidencia
			}
		}
	});

	server.io.emit("orden-eliminada", ordenEliminada);
	res.status(200).json({
		msg: "La orden  a sido eliminada con exito...",
	});
};

module.exports = {
	ordenexternaGet,
	ordenexternaPost,
	ordenexternaUpdate,
	ordenexternaDelete,
	ordenexternaGetTodos,
	ordenesGetfiltroExterna,
	ordenexternaById,
};
