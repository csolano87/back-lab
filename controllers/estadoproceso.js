const Estadoproceso = require("../models/estadoproceso");
const Proceso = require("../models/proceso");

const postestadoProceso = async (req, res) => {
	const { PROCESO_ID, ESATADO, PARTICIPACION } = req.body;
	console.log(req.body);

	const existeProceso = await Proceso.findByPk(PROCESO_ID);
	if (!existeProceso) {
		return res.status(400).json({ msg: "El proceso seleccionado no existe" });
	}
	const estadoproceso = new Estadoproceso({
		//PROCESO_ID,
		ESATADO: Number(PARTICIPACION),
		tramitesId: PROCESO_ID,
		procesoId: PROCESO_ID,
		tipocontratoId:  Number(PARTICIPACION),
	});
	await estadoproceso.save();

	res.status(201).json({
		msg: "Se guardo con exito el estado generado",
	});
};

const updateestadoProceso = async (req, res) => {
	const { ESTADO, PROCESO_ID, PARTICIPACION } = req.body;
	console.log(`++++++++++++++`, req.body);

	console.log(req.body);
	const validar = await Estadoproceso.findOne({where:{
		tramitesId:PROCESO_ID
	}});
	console.log(validar);

	if (!validar) {
		return res.status(404).json({ ok: false, msg: `El proceso no existe` });
		/* } else if (validarTramite.ESTADO == true) {
		return res
			.status(400)
			.json({ ok: false, msg: `No puede actualizar estado Rentable` }); */
	}
	await validar.update(
		{
			ESATADO: PARTICIPACION,
			tipocontratoId: PARTICIPACION,
		},
		{
			where: {
			tramitesId: PROCESO_ID,
			},
		}
	);
	res.status(200).json({
		msg: "Se actualizo con exito el estado del proceso ",
	});
};

module.exports = { postestadoProceso, updateestadoProceso };
