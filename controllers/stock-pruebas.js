const csvToJson = require("convert-csv-to-json");
const Pruebastock = require("../models/stockPruebas");

const getStockPruebas = async (req, res) => {
	const pruebas = await Pruebastock.findAll();
	res.status(200).json({ ok: true, pruebas: pruebas });
};

const postStockPruebas = async (req, res) => {
	const USUARIOID = req.usuario;
	console.log(USUARIOID);
	if (!req.file) {
		return res.status(400).json({ ok: false, msg: `No existe archivo` });
	}

	let archivo = req.file.path;
	let json = csvToJson.getJsonFromCsv(archivo);
	let pruebasGuardados = [];
	let pruebasDuplicados = [];
	for (const data of json) {
		data.USUARIOID = USUARIOID.id;
		const dataExistente = await Pruebastock.findOne({
			where: { IDENTIFICADOR: data.IDENTIFICADOR },
		});

		if (!dataExistente) {
			const guardarPruebas = await Pruebastock.create(data);
			pruebasGuardados.push(guardarPruebas);
			/*         res.status(200).json({ ok: true, msg: `Se guardo con exito las pruebas` });
			 */
		} else {
			pruebasDuplicados.push(dataExistente);
			//res.status(200).json({ ok: true, msg: `Las pruebas ya existen` });
		}
	}
	const duplicados = pruebasDuplicados.map(
		(dup) => dup.dataValues.IDENTIFICADOR
	);

	const guardado = pruebasGuardados.map((ext) => ext.dataValues.IDENTIFICADOR);

	if (guardado.length > 0 && duplicados.length > 0) {
		res.status(200).json({
			ok: true,
			msg: `Se han guardado con exito estos productos ${guardado}, pero existen productos duplicados
                ${duplicados},`,
		});
	} else if (guardado.length > 0 && duplicados.length == 0) {
		res.status(200).json({
			ok: true,
			msg: `Se ha ingresado con exito los siguientes productos  ${guardado}`,
		});
	} else {
		res.status(200).json({
			ok: true,
			msg: `Los productos ingresados ya existen en el sistema ${duplicados}`,
		});
	}
  
};
const deletePrueba =async(req,res)=>{
    const { id } = req.params;

	const prueba = await Pruebastock.findByPk(id);
	if (!prueba) {
		return res.status(404).json({
			ok: false,
			msg: `No existe la prueba seleccionado ${id}`,
		});
	}

	await prueba.update({ ESTADO: 0 });
	res.status(200).json({
		msg: "la prueba a sido desactivado con exito...",
	});

        
}

module.exports = {
	getStockPruebas,
	postStockPruebas,
    deletePrueba
};
