const Aprobar = require("../models/aprobarproceso");
const Proceso = require("../models/proceso");

const postProcesos = async (req, res) => {
	const { PROCESO_ID, ESTADOBI } = req.body;

	const existeProceso = await Proceso.findByPk(PROCESO_ID);
	if (!existeProceso) {
		return res.status(400).json({ msg: "El proceso seleccionado no existe" });
	}
	const aprobar = new Aprobar({
		PROCESO_ID,
		ESTADOBI,
		tramitesId: PROCESO_ID,
		procesoId: PROCESO_ID,
	});
	await aprobar.save();

	res.status(201).json({
		msg: "Se guardo con exito el estado generado",
	});
};

const updateProcesos = async (req, res) => {
	const { ESTADOBI, PROCESO_ID } = req.body;

	//console.log(req.body);
	const validarTramite = await Aprobar.findOne(  { where:
		{procesoId:PROCESO_ID}
	});
	//console.log(validarTramite);
	console.log(validarTramite);
	if (!validarTramite) {
		return res.status(404).json({ ok: false, msg: `El proceso no existe` });
	}
	if (validarTramite.ESTADOBI === 1) {
		
		return res
			.status(400)
			.json({ ok: false, msg: `No puede actualizar estado Rentable` });
	}
	await validarTramite.update(
		{
			ESTADOBI,
		},
		{
			where: {
				procesoId:PROCESO_ID,
				tramitesId:PROCESO_ID
			},
		}
	);
	res.status(200).json({
		msg: "Se actualizo con exito el estado del proceso por BI...",
	});
};

module.exports = { postProcesos, updateProcesos };
