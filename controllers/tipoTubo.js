const { Request, Response } = require("express");
const Envase = require("../models/tipoTubo");
const Tipomuestra = require("../models/tipomuestra");

const getTipotubo = async (req, res) => {
	const envase = await Envase.findAll({
		include: {
			model: Tipomuestra,
			as: "muestra",
		},
	});

	res.json({ ok: true, envase });
};

const postTipotubo = async (req, res) => {
	const {
		descripcion,
		codigo,
		abreviatura,
		volumenneto,
		volumenprueba,
		tipomuestraId,
	} = req.body;

	console.log(req.body); //abreviatura //abreviatura
	const envases = new Envase({
		codigo,
		descripcion,
		abreviatura,
		volumenneto,
		volumenprueba,
		tipomuestraId,
		muestraId: tipomuestraId,
	});
	const envase = await Envase.findOne({
		where: {
			codigo: envases.codigo,
		},
	});

	console.log(envase);

	if (envase) {
		return res.status(400).json({
			msg: "Este tubo  ya existe",
		});
	}

	await envases.save();
	res.status(201).json({ msg: "El tubo a sido registrado con exito" });
};
const deleteTipotubo = async (req, res) => {
	const { id } = req.params;

	const tubo = await Envase.findByPk(id);
	if (!tubo) {
		return res
			.status(400)
			.json({ ok: true, msg: `El tubo con el Id ${id} no existe` });
	}
	await tubo.update({ estado: false });
	res
		.status(200)
		.json({ ok: true, msg: `El tubo  a sido desactivado con exito..."` });
};
module.exports = { getTipotubo, postTipotubo, deleteTipotubo };
