//const bcrypt = require('bcrypt');
const bcryptjs = require("bcryptjs");
const { hashSync } = require("bcryptjs");
const Usuario = require("../models/usuarios");

const password = async (req, res) => {
  const id = req.params.id;
  const { password, newpassword } = req.body;
  console.log({ id, password, newpassword });

  const usuarioDB = await Usuario.findByPk(id);
  console.log("data DB", usuarioDB);
  if (usuarioDB) {
    const validarPassword = bcryptjs.compareSync(password, usuarioDB.password);

    /*    if (usuarioDB.id === id) { */
    if (validarPassword) {
      const salt = bcryptjs.genSaltSync();
      usuarioDB.password = bcryptjs.hashSync(newpassword, salt);
      console.log(usuarioDB);
      await usuarioDB.update({ password: usuarioDB.password });
      res
        .status(200)
        .json({ ok: true, msg: "La contrasena a sido cambiada con exito" });
    } else {
      res.status(400).json({ ok: false, msg: "La contraseña no es valida" });
    }
    /*  } else {
           
            res.status(400).json({ ok: false, msg: `El Id ${id} ingresado no es valido` })
          } */
  } else {
    res.status(400).json({ ok: false, msg: `El Id ${id} no existe` });
  }

  // res.status(200).json({ ok: true, msg: 'Se restalecio la constrasena con exito ' })
};

module.exports = { password };
