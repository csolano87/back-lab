const Despachopedido = require("../models/despachopedido");
const { sequelize } = require("../models/despachopedido");
const Itempedidostock = require("../models/itempedidostock");
const moment = require("moment");
moment.locale("es");

const getNotificar = async (req, res) => {
	/* const notificar = await Notificardespacho.findAll({});
	res.status(200).json({ ok: true, notificar }); */
};

const getNotificarByID = async (req, res) => {
	/* const { id } = req.params;
	const notificar = await Notificardespacho.findAll({
		where: { usuarioId: id },
	});
	res.status(200).json({ ok: true, notificar }); */
};
const postNotificar = async () => {};

const updateDespachopedido = async (req, res) => {
	const t = await sequelize.transaction();
	try {
		const hoy = moment();
		const now = moment();

		const fechaHora = now.format("YYYY-MM-DD HH:mm:ss");
		const fecha = hoy.format().slice(0, 10);
		console.log(fecha);
		const user = req.usuario;
		await sequelize.transaction(async (t) => {
			const {
				productoId,
				ID_PRODUCTO,
				bodegaId,
				lote,
				CANTIDAD,

				itempedidostockId,
				descargo,
			} = req.body;
			console.log(`---------->`, req.body);
			Despachopedido.decrement("cantidad_despachada", {
				by: Number(descargo),
				where: {
					productoId: productoId,
					ItempedidostockId: itempedidostockId,
					lote: lote,
					bodegaId,
				},
				transaction: t,
			});
console.log(`usuario--------------------------`,user.id)
			const itempedidoStock = await Itempedidostock.update(
				{
					fechadescargo: fechaHora,
					descargaId: user.id 
					}, // Campo que deseas actualizar
				{
					where: {
						ID_PRODUCTO: productoId,
						bodegaId: bodegaId,
						
					},
					transaction: t,
				}
			);
			//await t.commit();
			console.log(`itempedidoStock`, itempedidoStock);
			res.status(200).json({
				ok: true,
				msg: `Se realizo con el exito el descargo del producto`,
			});
		});
	} catch (error) {
		await t.rollback(); // Deshace los cambios si hay un error
		console.error("Error en la actualización de stock:", error);
	}
};

module.exports = {
	updateDespachopedido,
};
