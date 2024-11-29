const ItemStock = require("../models/itemStock");
const Producto = require("../models/productos");

const postTransferencia = async (req, res) => {
	const { BODEGA_ORIGEN_ID, BODEGA_DESTINO_ID, PRODUCTOS } = req.body;

	try {
		const productosEncontrados = [];

		const productosNoEncontrados = [];
		for (const producto of PRODUCTOS) {
			const { PRODUCTO_ID, CANTIDAD } = producto;

			const itemStock = await ItemStock.findOne({
				where: {
					bodegaId: BODEGA_ORIGEN_ID,
					referencia: PRODUCTO_ID,
				},
				include: {
					model: Producto,
					as: "product",
				},
			});
			console.log(itemStock);

			if (!itemStock) {
				productosNoEncontrados.push({
					producto: PRODUCTO_ID,
				});
				/* return res
					.status(404)
					.json({
						error: `Producto con ID ${PRODUCTO_ID} no encontrado en la bodega de origen.`,
					}); */
			}

			productosEncontrados.push({
				producto: itemStock.dataValues.referencia,
				nombre: itemStock.product.NOMBRE,
				lote: itemStock.lote,
				caducidad: itemStock.caducidad,
				cantidad: itemStock.cantidad,
			});
		}

		res.status(200).json({
			ok: true,
			productos: productosEncontrados,
			productoNo: productosNoEncontrados,
		});
	} catch (error) {
		console.error("Error al procesar los productos:", error);
		res
			.status(500)
			.json({ ok: false, error: "Error al procesar la solicitud." });
	}
};

module.exports = postTransferencia;
