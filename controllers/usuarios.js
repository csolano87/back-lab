const { Request, Response } = require("express");

const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuarios");
const { Op } = require("sequelize");
//const { substring } = require('sequelize/types/lib/operators');

const usuariosGet = async (req, res) => {
	/* const desde = Number(req.query.desde) || 0;
    const usuarios = await Usuario.findAll({ offset: desde, limit: 5 }) */

	//const total = await Usuario.count();
	/*  const activados = await Usuario.count({
        where: {
            estado: 'true'
        },

    }) */

	const usuarios = await Usuario.findAll({});
	res.json({ ok: true, usuarios: usuarios });
};

const usuariosGetID = async (req, res) => {
	const { id } = req.params;
	const existeUser = await Usuario.findByPk(id);

	res.status(200).json({ ok: true, user: existeUser });
};

const usuariosGetfiltro = async (req, res) => {
	const { busquedausuario } = req.params;

	const dataCA = busquedausuario.replace(/\w\S*/g, function (e) {
		return e.charAt(0).toUpperCase() + e.substring(1);
	});

	const data = await Usuario.findAll({
		where: {
			doctor: {
				[Op.like]: `%${dataCA}%`,
			},
		},
	});

	res.status(200).json({ ok: true, resultados: data });
};

const usuariosPost = async (req, res) => {
	try {
		const { doctor, codigo_doctor, usuario, password, rol } = req.body;

		const user = new Usuario({
			doctor,
			codigo_doctor,
			usuario,
			password,
			rol,
		});

		const existeUser = await Usuario.findOne({
			where: { usuario: user.usuario },
		});

		if (existeUser) {
			return res.status(400).json({ msg: "Este usuario ya existe" });
		}

		const salt = bcryptjs.genSaltSync();
		user.password = bcryptjs.hashSync(password, salt);

		await user.save();
		res.status(201).json({
			msg: "El usuario a sido registrado con exito",
		});
	} catch (error) {
		console.log(error);
	}
};

const usuariosUpdate = async (req, res) => {
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

const usuariosDelete = async (req, res) => {
	const { id } = req.params;

	const user = await Usuario.findByPk(id);

	if (!user) {
		return res.status(404).json({
			msg: `No existe un usuario con el id ${id}`,
		});
	}
	// await usuario.destroy();
	await user.update({ estado: false });
	res.status(200).json({
		msg: "El usuario a sido desactivado con exito...",
	});
};

module.exports = {
	usuariosGet,
	usuariosGetID,
	usuariosPost,
	usuariosUpdate,
	usuariosDelete,
	usuariosGetfiltro,
};
