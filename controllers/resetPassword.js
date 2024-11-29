//const bcrypt = require('bcrypt');
const bcryptjs = require("bcryptjs");
const { hashSync } = require("bcryptjs");
const Usuario = require("../models/usuarios");

const resetPassword = async (req, res) => {
	const id = req.params.id;
	const nuevaPassword = req.body.password;
	console.log({ id, nuevaPassword });

	const usuarioDB = await Usuario.findByPk(id);
	console.log("data DB", usuarioDB);
	if (usuarioDB) {
		const salt = bcryptjs.genSaltSync();
		const nuevaPasswor = bcryptjs.hashSync(nuevaPassword, salt);

		await usuarioDB.update({ password: nuevaPasswor });
		res.status(200).json({
			ok: true,
			msg: "La contrasena a sido cambiada con exito",
		});

		// res.status(400).json({ ok: false, msg: 'La contraseña no es valida' });
	} else {
		res.status(400).json({ ok: false, msg: `El Id ${id} no existe` });
	}

	// res.status(200).json({ ok: true, msg: 'Se restalecio la constrasena con exito ' })
};

module.exports = { resetPassword };
