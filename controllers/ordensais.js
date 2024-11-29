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
const Server = require("../models/server");
const axios = require("axios").default;
const hisMutex = new Mutex();
const out_dir = String.raw`C:\Users\devel\Videos`;
const cron = require("cron");

const ordensaisGetID = async (req, res) => {
	const { cedula } = req.params;
	console.log(cedula);
	let params = {
		cedula: `${cedula}`,
		token: process.env.token,
	};
	try {
		const insstance = axios.create({
			baseURL: process.env.QUEVEDO,
			params,
		});

		const resp2 = await insstance.get();
		//console.log(resp2.data)
		const groupedData = resp2.data.reduce((result, entry) => {
			const existingEntry = result.find(
				(item) => item.admi_id === entry.admi_id
			);
			if (existingEntry) {
				existingEntry.as400.push({
					exam_id: entry.exam_id,
					ItemID: entry.tipo_exam_id,
					ItemName: entry.tipo_exam_nombre,
					//  grup_exam_id: entry.grup_exam_id,
					//  grup_exam_nombre: entry.grup_exam_nombre,
					//labo_nombre: entry.labo_nombre,
					//  exam_fecha_creacion: entry.exam_fecha_creacion
				});
			} else {
				result.push({
					admi_id: entry.admi_id,
					IDENTIFICADOR: entry.pers_ci,
					NOMBRES: entry.nombres,
					APELLIDO: entry.apelidos,
					FECHANACIMIENTO: entry.pers_fech_naci,
					SEXO: entry.pers_sexo,
					CODTIPOORDEN: entry.area_id,
					NOMBRETIPOORDEN: entry.area_nombre,
					PRIORIDAD: entry.prio_id,
					APELLIDODOCTOR: entry.medi_apellidos,
					NOMBREDOCTOR: entry.medi_nombres,
					CODDOCTOR: entry.medi_ci,
					HIS: entry.atencion,
					TELEFONO: entry.pers_telefono,
					EMAIL: entry.pers_email,
					CONVENCIONAL: entry.pers_convencional,
					FECHACREACIONSAIS: entry.exam_fecha_creacion,
					as400: [
						{
							ExamID: entry.exam_id,
							ItemID: entry.tipo_exam_id,
							ItemName: entry.tipo_exam_nombre,
							//  grup_exam_id: entry.grup_exam_id,
							// grup_exam_nombre: entry.grup_exam_nombre,
							//  labo_nombre: entry.labo_nombre,
							//   exam_fecha_creacion: entry.exam_fecha_creacion
						},
					],
				});
			}

			return result;
		}, []);
		res.status(200).json({
			ok: true,
			orden: groupedData,
		});
	} catch (error) {}
};

// Llama a la función startCronJob para iniciar el trabajo cron cuando se inicia la aplicación.

const ordensaisGet = async (req, res) => {
	const server = Server.instance;
	let params = {
		token: process.env.token,
	};

	const insstance = axios.create({
		baseURL: process.env.QUEVEDO,
		params,
	});
	//const fetchDataAndProcess = async () => {
	try {
		const resp2 = await insstance.get();

		const groupedData = resp2.data.reduce((result, entry) => {
			const existingEntry = result.find(
				(item) => item.admi_id === entry.admi_id
			);
			if (existingEntry) {
				existingEntry.as400.push({
					exam_id: entry.exam_id,
					ItemID: entry.tipo_exam_id,
					ItemName: entry.tipo_exam_nombre,
					//  grup_exam_id: entry.grup_exam_id,
					//  grup_exam_nombre: entry.grup_exam_nombre,
					//labo_nombre: entry.labo_nombre,
					//  exam_fecha_creacion: entry.exam_fecha_creacion
				});
			} else {
				result.push({
					admi_id: entry.admi_id,
					IDENTIFICADOR: entry.pers_ci,
					NOMBRES: entry.nombres,
					APELLIDO: entry.apelidos,
					FECHANACIMIENTO: entry.pers_fech_naci,
					SEXO: entry.pers_sexo,
					CODTIPOORDEN: entry.area_id,
					NOMBRETIPOORDEN: entry.area_nombre,
					PRIORIDAD: entry.prio_id,
					APELLIDODOCTOR: entry.medi_apellidos,
					NOMBREDOCTOR: entry.medi_nombres,
					CODDOCTOR: entry.medi_ci,
					HIS: entry.atencion,
					TELEFONO: entry.pers_telefono,
					EMAIL: entry.pers_email,
					CONVENCIONAL: entry.pers_convencional,
					FECHACREACIONSAIS: entry.exam_fecha_creacion,
					as400: [
						{
							ExamID: entry.exam_id,
							ItemID: entry.tipo_exam_id,
							ItemName: entry.tipo_exam_nombre,
							//  grup_exam_id: entry.grup_exam_id,
							// grup_exam_nombre: entry.grup_exam_nombre,
							//  labo_nombre: entry.labo_nombre,
							//   exam_fecha_creacion: entry.exam_fecha_creacion
						},
					],
				});
			}

			return result;
		}, []);
		console.log(`***data Sais**`, groupedData.length);
		const dataBD = await Cabecera_Agen.findAll({});

		const or = dataBD.map((e) => e.admi_id);
		console.log(`***admi_id BD**`, or);
		const orden = groupedData.filter((item) => !or.includes(item.admi_id));
		console.log(`***SOLO PASA LOS QUE NO EXISTE EN BD**`, orden.length);
		await sequelize.transaction(async (t) => {
			for (const dataEntry of orden) {
				const {
					admi_id,
					IDENTIFICADOR,
					NOMBRES,
					APELLIDO,
					FECHANACIMIENTO,
					SEXO,
					CODTIPOORDEN,
					NOMBRETIPOORDEN,
					PRIORIDAD,
					APELLIDODOCTOR,
					NOMBREDOCTOR,
					CODDOCTOR,
					HIS,
					NUMEROORDEN,
					TELEFONO,
					EMAIL,
					CONVENCIONAL,
					CODEMBARAZADA,
					FECHACREACIONSAIS,
					CODCENTROSALUD,
					CODPROVINCIA,
					DIRECCION,

					OPERADOR,
					CODFLEBOTOMISTA,
					CORRELATIVO,
					CODIMPRESORA,
					FECHAORDEN,
					EDAD,
					HORAORDEN,
					HORATOMA,
					FECHATOMA,
				} = dataEntry;
				const cabecera_agen = await Cabecera_Agen.create(
					{
						admi_id,
						IDENTIFICADOR,
						NOMBRES,
						APELLIDO,
						FECHANACIMIENTO,

						SEXO,
						CODTIPOORDEN,
						NOMBRETIPOORDEN,
						PRIORIDAD,
						APELLIDODOCTOR,
						NOMBREDOCTOR,
						CODDOCTOR,
						HIS,
						NUMEROORDEN,
						TELEFONO,
						EMAIL,
						CONVENCIONAL,
						CODEMBARAZADA,
						FECHACREACIONSAIS,
						CODCENTROSALUD,
						CODPROVINCIA,
						DIRECCION,

						OPERADOR,
						CODFLEBOTOMISTA,
						CORRELATIVO,
						CODIMPRESORA,
						FECHAORDEN,
						EDAD,
						HORAORDEN,
					},
					{ transaction: t }
				);

				const createdDetails = await Detalle_Agen.bulkCreate(dataEntry.as400, {
					transaction: t,
				});

				await cabecera_agen.setAs400(createdDetails, { transaction: t });

				let params = {
					token: process.env.token,
					exam_id: dataEntry.exam_id,
				};

				const instance = axios.create({
					baseURL: process.env.QUEVEDO,

					params,
				});

				const resp2 = await instance.patch();
			}
		});

		const ordenSais = await Cabecera_Agen.findAll({
			include: {
				model: Detalle_Agen,
				as: "as400",
			},
			limit: 100,
			order: [["createdAt", "DESC"]],
		});
		server.io.emit("orden-sais", ordenSais);
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({ error: "Error occurred" });
	}
};

/* 
   const interval = 500000; // Intervalo de 1 minuto
setInterval(ordensaisGet, interval); 

// Ejecutar ordensaisGet directamente al principio
ordensaisGet();   */
const ordensaisPost = async (req, res) => {
	const user = req.usuario;

	console.log("FRONT ", req.body);
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

	console.log("AGREGANDO ID", req.body);

	await Cabecera_Agen.create({
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
	}).then((cabecera_agen) => {
		Detalle_Agen.bulkCreate(req.body.DLCEXAS).then((ItemID) => {
			cabecera_agen.setPruebas400(ItemID);
		});
		res.status(201).json({
			msg: `Se a creado exitosamente la orden # ${DLNUOR} para el paciente ${DLAPEL}  `,
		});
	});
};
const ordensaisUpdate = async (req, res) => {
	const id = req.body.id;
	//const user = req.usuario;

	console.log(`***********USER*********`, user);

	const {
		CODDOCTOR,
		CODTIPOORDEN,
		CODSALA,
		CODCENTROSALUD,
		CODEMBARAZADA,
		CODPROCEDENCIA,
		OPERADOR,
		DIRECCION,
		CODFLEBOTOMISTA,
		CORRELATIVO,
		CODIMPRESORA,
		FECHACITA,
		HORACITA,
		TIPOIDENTIFICADOR,
		IDENTIFICADOR,
		CODPROVINCIA,
		NOMBRES,
		APELLIDO,
		SEGUNDOAPELLIDO,
		FECHANACIMIENTO,
		EDAD,
		SEXO,
	} = req.body;

	await Cabecera.update(
		{
			CODDOCTOR,
			CODTIPOORDEN,
			CODSALA,
			CODCENTROSALUD,
			CODEMBARAZADA,
			CODPROCEDENCIA,
			OPERADOR,
			CODFLEBOTOMISTA,
			CORRELATIVO,
			CODIMPRESORA,
			FECHACITA: `${req.body.FECHACITA}` == "" ? null : FECHACITA,
			HORACITA,
			EDAD,
			DIRECCION,
			TIPOIDENTIFICADOR,
			IDENTIFICADOR,
			CODPROVINCIA,
			NOMBRES,
			APELLIDO,
			SEGUNDOAPELLIDO,
			FECHANACIMIENTO,
			EDAD,
			SEXO,
		},
		{ where: { id: id } }
	).then((cabecera) => {
		req.body.pruebas.forEach(async (e) => {
			console.log(req.body.pruebas);

			await Detalle.findOrCreate({
				where: {
					cabeceraId: id,
					ItemID: e.ItemID,
				},
				defaults: {
					ESTADO: e.ESTADO,
					ItemID: e.ItemID,
					ItemName: e.ItemName,
				},
			});
		});
		console.log(cabecera);
	});

	res.status(201).json({
		msg: `Se a actualizado la orden del paciente ${APELLIDO} ${NOMBRES} `,
	});
};

const ordensaisDelete = async (req, res) => {
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
	ordensaisGetID,
	ordensaisPost,
	ordensaisUpdate,
	ordensaisDelete,
	ordensaisGet,
};
