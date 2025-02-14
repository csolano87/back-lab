const { update } = require("lodash");
const Prueba = require("../models/pruebas");
const Orden = require("../models/ordenes");
const { Model } = require("sequelize");
const Itemprueba = require("../models/itemPruebas");
const moment = require("moment");
const { sequelize } = require("../models/pruebas");
const updateExamen = async (req, res) => {
	const hoy = moment();
	console.log(hoy)
	const [fecha, hora] = hoy.format("YYYY-MM-DDTHH:mm:ss").split('T');
	console.log(`**************************************************`,  fecha)
	console.log(`**************************************************`,  hora)


	const user = req.usuario;
	const { id } = req.params;
	const OrdeId = id;
	const { pruebas } = req.body;
	/* console.log(`----`, req.body); */

	const orden = await Orden.findByPk(OrdeId, {
		include: {
			model: Prueba,
			as: "prueba",
		},
	});

	if (!orden) {
		return res
			.status(404)
			.json({ ok: false, msg: `El id ${OrdeId} no existe` });
	}
	try {
		await sequelize.transaction(async (t) => {
			let updated = false;
			const pruebasArray = Array.isArray(pruebas) && pruebas.length > 0 ? pruebas : req.body;
			console.log(`**********`, pruebasArray)
			for (const item of pruebasArray) {
				const { ordenId, resultado,rangoId } = item;

				const pruebasExistente = await Prueba.findOne({
					where: {
						ordenId: OrdeId,
						panelpruebaId: ordenId,
					
					},
					transaction: t,
				});
				if (pruebasExistente) {
					await pruebasExistente.update(
						{
							resultado: resultado,
							estado:4,
							rangoId:rangoId,
							reportadaId:user.id,
							fechaordenreportada: fecha,
			horaordenreportada: hora
						},
						{ transaction: t }
					);
					updated = true;
				}
			}
			if (updated) {
				await orden.update({ estado: 2 }, { transaction: t });
			}
		});

		res.status(200).json({
			msg: `Se guardo los resultados   con exito`,
		});
	} catch (error) {
		console.error("Error updating results:", error);
		res.status(500).json({
			ok: false,
			msg: "Ocurrió un error al guardar los resultados.",
		});
	}
};

module.exports = { updateExamen };
