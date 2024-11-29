const { Request, Response } = require("express");

const Proceso = require("../models/proceso");

const pdf = require("html-pdf");

const nodemailer = require("nodemailer");
const path = require("node:path");
const mailer = require("../templates/signup-mail");
const Usuario = require("../models/usuarios");
const { Op, where, Sequelize } = require("sequelize");
const Aprobar = require("../models/aprobarproceso");
const Solicitud_Proceso = require("../models/solicitud_proceso");
const Pedido = require("../models/pedido");
const Itempedido = require("../models/itemPedido");
const Estadoproceso = require("../models/estadoproceso");
const Tipocontrato = require("../models/tipocontrato");

const getproceso = async (req, res) => {
	const id = req.params;
	const totalProcesos = await Proceso.count();

	const totalProcesosPorAprobarBI = await Proceso.findAll({
		attributes: [
			[
				Sequelize.literal(
					`CASE WHEN aprobar.ESTADOBI = 1 THEN 'Rentable' ELSE 'No Rentable' END`
				),
				"estado_aprobar_bi",
			],
			[
				Sequelize.fn(
					"COUNT",
					Sequelize.literal(`CASE WHEN aprobar.ESTADOBI = 1 THEN 1 ELSE 0 END`)
				),
				"total",
			],
		],
		include: [
			{
				model: Aprobar,
				as: "aprobar",
				attributes: [],
			},
		],
		group: [
			Sequelize.literal(
				`CASE WHEN aprobar.ESTADOBI = 1 THEN 'Rentable' ELSE 'No Rentable' END`
			),
		],
	}); 

	const data = await Proceso.findAll({
		include: [
			{
				model: Aprobar,
				as: "aprobar",
			},
			{
				model: Solicitud_Proceso,
				as: "solicitud",
			},
			{
				model: Estadoproceso,
				as: "status",
				include:{
					model:Tipocontrato,
					as:"tipocontrato"
				}
			},
			{
				model: Pedido,
				as: "pedidos",
				include:{
					model:Itempedido,
					as:"items"
				}
			},

			
		],
	});

	res.status(200).json({
		ok: true,
		proceso: data,
		totalProcesos: totalProcesos,
		totalProcesosPorAprobarBI: totalProcesosPorAprobarBI,
	});
};

const getByIDproceso = async (req, res) => {
	const id = req.params.id;

	console.log(id);

	const procesoId = await Proceso.findByPk(id,{
		include: [
			{
				model: Aprobar,
				as: "aprobar",
			},
			{
				model: Solicitud_Proceso,
				as: "solicitud",
			},
			{
				model: Estadoproceso,
				as: "status",
				include:{
					model:Tipocontrato,
					as:"tipocontrato"
				}
			},
			{
				model: Pedido,
				as: "pedidos",
				include:{
					model:Itempedido,
					as:"items"
				}
			},

			
		],
	});
	res.status(200).json({ ok: true, proceso: procesoId });
};

const getByProceso = async (req, res) => {
	const { termino } = req.params;
	console.log(termino);
	const dataCA = termino.replace(/\w\S*/g, function (e) {
		return e.charAt(0).toUpperCase() + e.substring(1);
	});

	const data = await Proceso.findAll({
		where: {
			institucion: {
				[Op.like]: `%${dataCA}%`,
			},
		},
	});
	res.status(200).json({ ok: true, proceso: data });
};

const createregistro = async (req, res) => {
	const user = req.usuario;
	const {
		institucion,
		codigo,
		linkproceso,
		tiempoconsumo,
		determinacion,
		presupuesto,
		entregacarpeta,
		areas,
		terceraopcion,
		sistema,
		equipoprincipal,
		equipobackup,
		observacion,
		licenciaEquiposHematologicos,
		adjunto,
		correo,
	} = req.body;

	const validacodigo = await Proceso.findOne({ codigo: codigo });
	console.log(`req.body`, req.body);

	/* if (validacodigo != null) {
		return res.status(400).json({ msg: "La orden no se puede registar" });
	}  */
	/* 
	if (validacodigo.codigo === codigo) {
		return res
			.status(400)
			.json({ msg: "Este codigo que esta ingresando  ya existe" });
	} */

	//const correo2 = correo.replace(/(\r\n|\n|\r)/gm, ";");
	console.log(
		`adjunto`,
		areas.filter((item) => item !== null)
	);
	const registro = new Proceso({
		institucion,
		codigo,
		linkproceso,
		tiempoconsumo,
		determinacion,
		presupuesto,
		entregacarpeta,
		areas: areas.filter((item) => item !== null),
		terceraopcion,
		sistema,
		equipoprincipal,
		equipobackup,
		observacion,
		usuarioId: user.doctor,
		licenciaEquiposHematologicos: licenciaEquiposHematologicos.filter(
			(it) => it !== null
		),
	});

	await registro.save();

	res
		.status(200)
		.json({ ok: true, msg: `Se ha registrado con exito ${codigo}` });
};

const updateregistro = async (req, res) => {
	const id = req.body.id;
	const existeProceso = await Proceso.findByPk(id);

	if (!existeProceso) {
		return res.status(400).json({ ok: false, msg: `El ${id} no existe  ` });
	}
	const {
		institucion,
		codigo,
		linkproceso,
		tiempoconsumo,
		determinacion,
		presupuesto,
		entregacarpeta,
		areas,
		terceraopcion,
		sistema,
		equipoprincipal,
		equipobackup,
		observacion,
		licenciaEquiposHematologicos,
		adjunto,
		correo,
	} = req.body;
	await Proceso.update(
		{
			institucion,
			codigo,
			linkproceso,
			tiempoconsumo,
			determinacion,
			presupuesto,
			entregacarpeta,
			areas,
			terceraopcion,
			sistema,
			equipoprincipal,
			equipobackup,
			observacion,
			licenciaEquiposHematologicos,
			adjunto,
			correo,
		},
		{ where: { id: id } }
	);

	res
		.status(200)
		.json({ ok: true, msg: `Se actualizo  proceso con el #${id}` });
};

const usuariosDelete = async (req, res) => {
	//   res.status(200).json({ msg 'El usuario a sido desactivado con exito...'  });
};

module.exports = {
	getproceso,
	createregistro,
	getByProceso,
	getByIDproceso,
	updateregistro,
};
