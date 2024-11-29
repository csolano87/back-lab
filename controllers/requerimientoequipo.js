const { Request, Response } = require("express");

const Roles = require("../models/role");
const { Op } = require("sequelize");
const Solicitud_Proceso = require("../models/solicitud_proceso");
const Proceso = require("../models/proceso");
const Itemequipo = require("../models/itemEquipo");

const consultaRequerimientoEquipo = async (req, res) => {
	const solicitud = await Solicitud_Proceso.findAll({
		/* where: {
				rol: {
					[Op.ne]: "ADMIN",
				},
			}, */
	});

	res.json({ ok: true, solicitud });
};

const GetIDRequerimientoEquipo = async (req, res) => {
	const IDSolicitud = await Proceso.findByPk(id);
	if (!IDSolicitud) {
		return res.status(404).json({
			msg: "El proceso no existe",
		});
	}

	res.status(200).json({ ok: true, IDSolicitud });
};

const postRequerimientoEquipo = async (req, res) => {
	const { PROCESO_ID, MODALIDAD_ID, FECHAENTREGA, OBSERVACIONES, EQUIPO_ID } =
		req.body;

	const t = await Solicitud_Proceso.sequelize.transaction();
	try {
		//const existesolicitud = await Proceso.findOne({})

		console.log(req.body)
		const nuevasolictud = await Solicitud_Proceso.create(
			{
				PROCESO_ID,
				MODALIDAD_ID,
				FECHAENTREGA,
				OBSERVACIONES,
				//EQUIPO_ID,
			},
			{ transaction: t }
		);
		for (const item of EQUIPO_ID) {
			item.tramitesId = nuevasolictud.PROCESO_ID;
		}
		await Itemequipo.bulkCreate(EQUIPO_ID, { transaction: t });
		await t.commit();
		return res
			.status(201)
			.json({ ok: true, msg: `La Solictud de equipo a  registrado con exito` });
	} catch (error) {
		await t.rollback();
		return res.status(500).json({ ok: false, msg: 'Error al crear la solicitud de equipo', error });

	}

	//res.status(201).json({ msg: "Se guardo con exito la solicitud de equipo" });
};

const RequerimientoEquipoUpdate = async (req, res) => {
	res.send("update guardada con exito..");
};

const RequerimientoEquipoDelete = async (req, res) => {
	res.status(200).json({
		msg: "El usuario a sido desactivado con exito...",
	});
};

module.exports = {
	RequerimientoEquipoDelete,
	RequerimientoEquipoUpdate,
	consultaRequerimientoEquipo,
	postRequerimientoEquipo,
	GetIDRequerimientoEquipo,
};
