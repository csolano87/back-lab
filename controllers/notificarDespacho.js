const Notificardespacho = require("../models/notificarDespacho");

const getNotificar = async (req, res) => {
	const notificar = await Notificardespacho.findAll({});
	res.status(200).json({ ok: true, notificar });
};

const getNotificarByID = async (req, res) => {
	const { id } = req.params;
	const notificar = await Notificardespacho.findAll({
		where: { usuarioId: id },
	});
	res.status(200).json({ ok: true, notificar });
};
const postNotificar = async () => {};

const updateNotificar = async (req, res) => {
	const { id } = req.params;
	const { estado } = req.body;
	console.log(id);
	const notifica = await Notificardespacho.findByPk(id);
	console.log(notifica);
	if (!notifica) {
		return res
			.status(400)
			.json({ ok: false, msg: `El Id ${id} no existe en el sistema` });
	}
	await notifica.update(
		{
			estado: estado,
		}
	);

	res.status(200).json({ ok: true, msg: `Se actualizo el estado con exito` });
};

module.exports = {
	getNotificar,
	postNotificar,
	getNotificarByID,
	updateNotificar,
};
