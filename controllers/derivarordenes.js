const { transform } = require("pdfkit");
const OrdenImport = require("../models/ordenImport");
const PruebaOrdenImport = require("../models/pruebaOrdenImport");
const { sequelize } = require("../models/pruebaOrdenImport");
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
const postDerivarOrden = async (req, res) => {
	const t = await sequelize.transaction();

	try {
		for (const ordenData of req.body) {
			const {
				cedula,
				nombres,
				fechanac,
				sexo,
				historia,
				origenOrden,
				procedencia,
				doctor,
				numeroroden,
				prueba,
			} = ordenData;
			const ordenExistente = await OrdenImport.findOne({
				where: { numeroroden: numeroroden },
			});

			if (!ordenExistente) {
				const orden = await OrdenImport.create(
					{
						cedula,
						nombres,
						fechanac,
						sexo,
						historia,
						origen: origenOrden,
						procedencia,
						doctor,
						numeroroden,
					},
					{ transaction: t }
				);

				const pruebas = await Promise.all(
					prueba.map(async (item) => {
						return await PruebaOrdenImport.create(
							{
								testID: item.TestID,
								testNAME: item.TestName,
							},
							{ transaction: t }
						);
					})
				);

				await orden.setPruebaImport(pruebas, { transaction: t });
			}
			await t.commit();
			res.status(200).json({
				msg: `El archivo a sido guardado con exito `,
			});
		}
	} catch (error) {
		await t.rollback();
		console.error(error);
		res.status(500).json({ msg: "Error al guardar la orden y sus pruebas" });
	}
};

const putDerivarOrden = async (req, res) => {};

module.exports = {
	getDerivarOrden,
	postDerivarOrden,
	putDerivarOrden,
};
