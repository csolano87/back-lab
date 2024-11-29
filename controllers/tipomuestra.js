const { Request, Response } = require("express");

const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuarios");
const { Op } = require("sequelize");
const Tipomuestra = require("../models/tipomuestra");
//const { substring } = require('sequelize/types/lib/operators');

const tipoMuestraGet = async (req, res) => {


	const tipomuestra = await Tipomuestra.findAll({});
	res.json({ ok: true, tipomuestra });
};

const tipoMuestraGetID = async (req, res) => {
	const { id } = req.params;
	const existeUser = await Usuario.findByPk(id);

	res.status(200).json({ ok: true, user: existeUser });
};

const tipoMuestraGetfiltro = async (req, res) => {
	const { busquedausuario } = req.params;

	const dataCA = busquedausuario.replace(/\w\S*/g, function (e) {
		return e.charAt(0).toUpperCase() + e.substring(1);
	});
	//  console.log(dataCA)
	const data = await Usuario.findAll({
		where: {
			doctor: {
				[Op.like]: `%${dataCA}%`,
			},
		},
	});

	res.status(200).json({ ok: true, resultados: data });
};

const tipoMuestraPost = async (req, res) => {
	try {
		const { codigo, nombre, abreviatura,  } = req.body;

		const tipomuestras = new Tipomuestra({
			codigo, nombre, abreviatura
		});

		const tipomuestra = await Tipomuestra.findOne({
			where: { codigo: tipomuestras.codigo },
		});

		if (tipomuestra) {
			return res.status(400).json({ msg: "El tipo de muestra  ya existe" });
		}

		

		await tipomuestras.save();
		res.status(201).json({
			msg: "El tipo de muestra  a sido registrado con exito",
		});
	} catch (error) {
		console.log(error);
	}
};

const tipoMuestraUpdate = async (req, res) => {
	const id = req.body.id;

	const existeUser = await Usuario.findByPk(id);
	if (!existeUser) {
		return res.status(404).json({ ok: true, msg: "no existe usuario" });
	}

	const { doctor, usuario, rol } = req.body;

	const usuarioUpdate=await Usuario.update(
		{
			doctor,
			usuario,
			rol,
		},
		{ where: { id: id } }
	);

	res.status(200).json({ ok: true, msg: `Se actualizo con exito los datos del usuario` });
};

const tipoMuestraDelete = async (req, res) => {
	const { id } = req.params;

	const muestra = await Tipomuestra.findByPk(id);

	if (!muestra) {
		return res.status(404).json({
			msg: `No existe el tipo de muestra con el id ${id}`,
		});
	}
	// await usuario.destroy();
	await muestra.update({ estado: false });
	res.status(200).json({
		msg: "el tipo de muestra a sido desactivado con exito...",
	});
};

module.exports = {
	tipoMuestraDelete,
    tipoMuestraGetID,
    tipoMuestraGetfiltro,
    tipoMuestraPost,
    tipoMuestraUpdate   , 
    tipoMuestraGet
};
