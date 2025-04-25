const { transform } = require("pdfkit");
const OrdenImport = require("../models/ordenImport");
const PruebaOrdenImport = require("../models/pruebaOrdenImport");
const { sequelize } = require("../models/pruebaOrdenImport");
const { Sequelize } = require("sequelize");
const getDerivarOrden = async (req, res) => {
	const { fecha } = req.params;
	const ordenes = await OrdenImport.findAll({
		//where: { fechaOrden: fecha },
		include: {
			model: PruebaOrdenImport,
			as: "pruebaImport",
		},
	});
	res.status(200).json({ ok: true, ordenes });
};

const getBYIdDerivarOrden = async (req, res) => {
	const { id } = req.params;
	console.log(id);
	const ordenes = await OrdenImport.findOne({
		where: { numeroorden: id },
		include: {
			model: PruebaOrdenImport,
			as: "pruebaImport",
			where: { estado: 1 },
		},
	});
	res.status(200).json({ ok: true, ordenes });
};

const postDerivarOrden = async (req, res) => {
	console.log(`import`, req.body);
	const t = await sequelize.transaction();

	try {
		for (const ordenData of req.body) {
			const {
				cedula,
				nombres,
				fechanac,
				sexo,
				edad,
				histClinic,
				origenOrden,
				procedencia,
				doctor,
				numeroroden,
				prueba,
			} = ordenData;
			const ordenExistente = await OrdenImport.findOne({
				where: { numeroorden: numeroroden },
			});

			if (!ordenExistente) {
				const orden = await OrdenImport.create(
					{
						cedula,
						nombres,
						fechanac,
						sexo,
						edad,
						historia: histClinic,
						origen: origenOrden,
						procedencia,
						doctor,
						numeroorden: numeroroden,
					},
					{ transaction: t }
				);

				const pruebas = await Promise.all(
					prueba.map(async (item) => {
						return await PruebaOrdenImport.create(
							{
								testID: item.TestID,
								testNAME: item.TestName,
								TestABREV: item.TestABREV,
							},
							{ transaction: t }
						);
					})
				);

				await orden.setPruebaImport(pruebas, { transaction: t });
			}
		}
		await t.commit();
		res.status(200).json({
			msg: `El archivo a sido guardado con exito `,
		});
	} catch (error) {
		await t.rollback();
		console.error(error);
		res.status(500).json({ msg: "Error al guardar la orden y sus pruebas" });
	}
};

const putDerivarOrden = async (req, res) => {
	const { numeroorden, prueba } = req.body;
	const t = await sequelize.transaction();
	try {
		const orden = await OrdenImport.findOne({ where: { numeroorden:numeroorden } });
		console.log(orden);
		if (!orden) {
			return res.status(404).json({ msg: "Orden no encontrada" });
		}

		for (const item of prueba) {
			await PruebaOrdenImport.update(
				{
					//  resultado: item.resultado === "" ? 0 : item.resultado,
					resultado: item.resultado === "" ? 0 : item.resultado,
					estado: 0,
				},
				{
					where: {
						//ordenImportId
						ordenImportId: orden.id,
						TestABREV: item.testID,
					},
				},
				{ transaction: t }
			);
		}

		await orden.update({ estado: 0 }, { transaction: t });

		await t.commit();
		return res
			.status(200)
			.json({ msg: "Resultados actualizados correctamente" });
	} catch (error) {
		await t.rollback();
		console.error("Error al actualizar resultados:", error);
		return res.status(500).json({ msg: "Error interno del servidor" });
	}
};

module.exports = {
	getDerivarOrden,
	postDerivarOrden,
	putDerivarOrden,
	getBYIdDerivarOrden,
};
