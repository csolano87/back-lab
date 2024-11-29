const { Request, Response } = require("express");
const { Op, and, Sequelize } = require("sequelize");
const fs = require("fs");
const moment = require("moment");
const bcryptjs = require("bcryptjs");
const { Mutex } = require("async-mutex");
const axios = require("axios").default;
const Cabecera = require("../models/cabecera");
const Detalle = require("../models/detalle");
const path = require("path");
const { where } = require("sequelize");
const { sequelize } = require("../models/cabecera");
const db = require("../db/connection");
const Usuario = require("../models/usuarios");
const Cabecera_Agen = require("../models/cabecera_agen");
const Detalle_Agen = require("../models/detalle_agen");
const hisMutex = new Mutex();
const out_dir = String.raw`C:\Users\devel\Videos`;

const pacienteGetfiltro = async (req, res) => {
	const { cedula } = req.params;
	/* 
	let where = {};
	if (HIS) {
		where.HIS = {
			[Op.eq]: HIS,
		    
		};
	} */

	const data = await Cabecera_Agen.findOne({
		where: {
			IDENTIFICADOR: cedula,
		},

		/* include: {
			model: Detalle,
			as: 'pruebas',
			attributes: ['ItemID', 'ItemName', 'ESTADO'],
		}, */
	});

	res.status(200).json({ ok: true, orden: data });
};

const categoriaGet = async (req, res) => {
	/* 	const orden=await Cabecera.findAll({
			attributes:['FECHAORDEN',[Sequelize.fn('COUNT',Sequelize.col('FECHAORDEN')),'count']],
			group:['FECHAORDEN'],
		})
	
	res.status(200).json({
				ok: true,
				ordenes: orden,
				
			}); */

	/* const totalEmergencia = await Cabecera.count({
		where: { CODTIPOORDEN: 3, ESTADO: 1 },
	});
 */
	const salas = [
		{ id: 408, nombre: "ALOJAMIENTO CONJUNTO" },
		{ id: 123, nombre: "CONSULTA EXTERNA" },
		{ id: 420, nombre: "CUIDADOS INTERMEDIOS" },
		{ id: 401, nombre: "EMERGENCIA" },
		{ id: 402, nombre: "EMERGENCIA PEDIATRICA" },
		{ id: 414, nombre: "GINECOLOGIA" },
		{ id: 403, nombre: "LABOR DE PARTO" },
		{ id: 409, nombre: "MATERNIDAD" },

		{ id: 407, nombre: "NEONATO" },
		{ id: 405, nombre: "OBSERVACION ADULTO" },
		{ id: 404, nombre: "OBSERVACION PEDIATRICA" },
		{ id: 416, nombre: "PEDIATRIA" },
		{ id: 415, nombre: "QUIROFANO" },
		{ id: 418, nombre: "REANIMACION" },
		{ id: 419, nombre: "SAL DE COVID 19" },
		{ id: 413, nombre: "SAN JOSE" },

		{ id: 412, nombre: "SAN VICENTE" },
		{ id: 410, nombre: "SANTA LUISA" },
		{ id: 411, nombre: "SANTA MAGDALENA" },
		{ id: 406, nombre: "UCI" },
	];

	const totalAcepta = await Cabecera.count({ where: { ESTADO: 1 } });
	const totalIngresada = await Cabecera.count({ where: { ESTADO: 2 } });
	const user = req.usuario;

	const prioridad = [
		{ id: 1, nombre: "Urgente" },
		{ id: 2, nombre: "Rutina" },
		{ id: 3, nombre: "Control" },
	];

	const ordenes = await Cabecera_Agen.findAll({
		include: {
			model: Detalle_Agen,
			as: "as400",
			//	attributes: ['ItemID', 'ItemName', 'ESTADO'],
		},
		//where:{ESTADO:1,PRIORIDAD:1},
		limit: 100,
		order: [
			["createdAt", "DESC"],
			["PRIORIDAD", "ASC"],
			["ESTADO", "ASC"],
		],
	});

	ordenes.forEach((objeto) => {
		if (objeto.PRIORIDAD) {
			const GroupsArray = objeto.PRIORIDAD.split(",");

			const GroupsList = GroupsArray.map((item) => {
				const referenciaObjeto = prioridad.find(
					(ref) => ref.id === Number(item)
				);
				console.log(`93**`, item);
				if (referenciaObjeto) {
					return referenciaObjeto.nombre;
				}
				return item;
			});
			console.log(`93**`, GroupsList);
			objeto.PRIORIDAD = GroupsList;
		}
	});

	res.status(200).json({
		ok: true,
		ordenes: ordenes,
		TotalAcepta: totalAcepta,
		TotalIngresada: totalIngresada,
		//	TotalEmergencia: totalEmergencia,
	});
};
const ordenesGetID = async (req, res) => {
	const { id } = req.params;
	const salas = [
		{ id: 408, nombre: "ALOJAMIENTO CONJUNTO" },
		{ id: 123, nombre: "CONSULTA EXTERNA" },
		{ id: 420, nombre: "CUIDADOS INTERMEDIOS" },
		{ id: 401, nombre: "EMERGENCIA" },
		{ id: 402, nombre: "EMERGENCIA PEDIATRICA" },
		{ id: 414, nombre: "GINECOLOGIA" },
		{ id: 403, nombre: "LABOR DE PARTO" },
		{ id: 409, nombre: "MATERNIDAD" },

		{ id: 407, nombre: "NEONATO" },
		{ id: 405, nombre: "OBSERVACION ADULTO" },
		{ id: 404, nombre: "OBSERVACION PEDIATRICA" },
		{ id: 416, nombre: "PEDIATRIA" },
		{ id: 415, nombre: "QUIROFANO" },
		{ id: 418, nombre: "REANIMACION" },
		{ id: 419, nombre: "SAL DE COVID 19" },
		{ id: 413, nombre: "SAN JOSE" },

		{ id: 412, nombre: "SAN VICENTE" },
		{ id: 410, nombre: "SANTA LUISA" },
		{ id: 411, nombre: "SANTA MAGDALENA" },
		{ id: 406, nombre: "UCI" },
	];

	const orden = await Cabecera_Agen.findOne({
		where: {
			id: id,
		},

		include: {
			model: Detalle_Agen,

			as: "as400",
			attributes: ["ItemID", "ItemName", "ESTADO"],
		},
	});

	if (orden.ESTADO === 3) {
		console.log("estado 3");

		const ordenR = await Cabecera_Agen.findOne({
			where: {
				id: id,
			},

			include: {
				model: Detalle_Agen,

				as: "as400",

				attributes: ["ItemID", "ItemName", "ESTADO"],
				where: {
					ESTADO: "2",
				},
			},
		});

		res.status(200).json({ ok: true, orden: ordenR });
	} else {
		console.log("no hay estado 3");
		res.status(200).json({ ok: true, orden: orden });
	}
};
const ordenesGetfiltro = async (req, res) => {
	console.log("params", req.query);

	const prioridad = [
		{ id: 1, nombre: "Urgente" },
		{ id: 2, nombre: "Rutina" },
		{ id: 3, nombre: "Control" },
	];
	const {
		IDENTIFICADOR,
		NUMEROORDEN,
		ESTADO,
		HIS,
		FECHACITA,
		FECHAORDEN,
		SALA,
		PRIORIDAD,
		APELLIDO,
	} = req.query;
	console.log("**********IDENTIFICADOR**********", IDENTIFICADOR);
	console.log("**********NUMEROORDEN**********", NUMEROORDEN);
	console.log("**********ESTADO**********", ESTADO);
	console.log("**********HIS**********", HIS);
	console.log("**********FECHACITA**********", FECHACITA);
	console.log("**********FECHAORDEN**********", SALA);
	console.log("**********FECHACITA**********", PRIORIDAD);
	console.log("**********FECHAORDEN**********", APELLIDO);
	let where = {};
	if (IDENTIFICADOR) {
		where.IDENTIFICADOR = {
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
		where.admi_id = {
			[Op.eq]: HIS,
		};
	}

	if (FECHACITA) {
		where.FECHACREACIONSAIS = {
			[Op.eq]: FECHACITA,
		};
	}

	if (FECHAORDEN) {
		where.FECHAORDEN = {
			[Op.eq]: FECHAORDEN,
		};
	}

	if (SALA) {
		where.CODTIPOORDEN = {
			[Op.eq]: SALA,
		};
	}
	if (PRIORIDAD) {
		where.PRIORIDAD = {
			[Op.eq]: PRIORIDAD,
		};
	}
	if (APELLIDO) {
		where.APELLIDO = {
			[Op.like]: "%" + APELLIDO + "%",
		};
	}

	const data = await Cabecera_Agen.findAll({ where });

	data.forEach((objeto) => {
		console.log(objeto.PRIORIDAD);
		if (objeto.PRIORIDAD) {
			const GroupsArray = objeto.PRIORIDAD.split(",");

			const GroupsList = GroupsArray.map((item) => {
				const referenciaObjeto = prioridad.find(
					(ref) => ref.id === Number(item)
				);
				console.log(`93**`, item);
				if (referenciaObjeto) {
					return referenciaObjeto.nombre;
				}
				return item;
			});
			console.log(`93**`, GroupsList);
			objeto.PRIORIDAD = GroupsList;
		}
	});

	data.sort(function (a, b) {
		// Convierte las fechas de creación en objetos Date
		var fechaA = new Date(a.FECHACREACIONSAIS);
		var fechaB = new Date(b.FECHACREACIONSAIS);

		// Compara las fechas (orden descendente para la fecha más reciente primero)
		return fechaB - fechaA;
	});
	res.status(200).json({ ok: true, resultados: data });
};

const categoriaPost = async (req, res) => {
	const user = req.usuario;

	await sequelize.transaction(async (t) => {
		const {
			CODDOCTOR,
			CODTIPOORDEN,
			CODSALA,
			CODEMBARAZADA,
			CODESPECIALIDADES,
			CODCENTROSALUD,
			CODPROVINCIA,
			DIRECCION,
			TELEFONO,
			EMAIL,
			FECHACITA,

			HORACITA,
			OPERADOR,
			CODFLEBOTOMISTA,
			CORRELATIVO,
			CODIMPRESORA,

			TIPOIDENTIFICADOR,
			IDENTIFICADOR = datID,
			NOMBRES,
			APELLIDO,
			SEGUNDOAPELLIDO,
			FECHANACIMIENTO,
			EDAD,
			SEXO,
			USUARIO_ID = user.id,
			HIS,
		} = req.body;

		console.log("AGREGANDO ID", req.body);

		const cabecera_agen = await Cabecera_Agen.create(
			{
				CODDOCTOR,
				CODTIPOORDEN,
				CODSALA,
				CODEMBARAZADA,
				CODESPECIALIDADES,
				CODCENTROSALUD,
				CODPROVINCIA,
				DIRECCION,
				TELEFONO,
				EMAIL,

				HORACITA,
				OPERADOR,
				FECHACITA: `${req.body.FECHACITA}` == "" ? null : FECHACITA,
				HORACITA,
				CODFLEBOTOMISTA,
				CORRELATIVO,
				CODIMPRESORA,
				CODESPECIALIDADES,
				TIPOIDENTIFICADOR,
				IDENTIFICADOR,
				NOMBRES,
				APELLIDO,
				SEGUNDOAPELLIDO,
				FECHANACIMIENTO,
				EDAD,
				SEXO,
				USUARIO_ID,
				HIS,
			},
			{ transaction: t }
		);

		const createdDetails = await Detalle_Agen.bulkCreate(req.body.pruebas, {
			transaction: t,
		});

		await cabecera_agen.setAs400(createdDetails, { transaction: t });

		//await t.commit();

		let params = {
			token: process.env.token,
			exam_id: `${HIS}`,
		};
		const instance = axios.create({
			baseURL: process.env.QUEVEDO,
			params,
		});

		const resp2 = await instance.patch();

		res.status(201).json({
			msg: `Se a integrado  la orden # ${HIS} para el paciente ${APELLIDO} ${NOMBRES} respuesta de SAIS ${resp2.data}`,
		});
	});
};

const categoriaUpdate = async (req, res) => {
	const id = req.body.id;
	const user = req.usuario;

	console.log(`***********USER*********`, user);
	await sequelize.transaction(async (t) => {
		const {
			APELLIDO,
			NOMBRES,
			SEXO,
			CODEMBARAZADA,
			OPERADOR,
			CODFLEBOTOMISTA,
			CODCENTROSALUD,
			CORRELATIVO,
			CODIMPRESORA,
		} = req.body;

		try {
			// Obtén el registro que deseas actualizar en Cabecera_Agen
			const cabecera_agen = await Cabecera_Agen.findByPk(id);

			if (!cabecera_agen) {
				throw new Error("No se encontró el registro en Cabecera_Agen");
			}

			await Cabecera_Agen.update(
				{
					SEXO,
					CODEMBARAZADA,
					OPERADOR,
					CODFLEBOTOMISTA,
					CODCENTROSALUD,
					CORRELATIVO,
					CODIMPRESORA,
				},
				{
					where: { id: id },
					transaction: t,
				}
			);

			// Actualiza los estados de las pruebas en Detalle_Agen
			await Promise.all(
				req.body.pruebas.map(async (prueba) => {
					const { ItemID, ESTADO } = prueba;

					await Detalle_Agen.update(
						{ ESTADO }, // Campo a actualizar
						{
							where: {
								cabeceraId: id, // Filtro para identificar la fila específica
								ItemID: ItemID, // Filtro para identificar el registro específico
							},
							transaction: t,
						}
					);
				})
			);

			res.status(200).json({
				msg: `Se a actualizado la orden del paciente ${APELLIDO} ${NOMBRES} `,
			});
		} catch (error) {
			console.error("Error en la transacción:", error);
			res.status(500).json({
				error: "Error en la transacción",
			});
		}
	});
};

const categoriaDelete = async (req, res) => {
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

	await orden.update({ ESTADO: 0 });
	res.status(200).json({
		msg: "La orden  a sido eliminada con exito...",
	});
};

module.exports = {
	categoriaGet,
	categoriaPost,
	categoriaUpdate,
	categoriaDelete,

	ordenesGetID,
	ordenesGetfiltro,
	pacienteGetfiltro,
};
