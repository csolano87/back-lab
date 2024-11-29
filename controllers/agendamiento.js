const axios = require("axios").default;
const csvtojson = require("csvtojson");
const fs = require("fs");

const pruebasQuevedo = require("../json/pruebasQuevedo");
const Pruebastock = require("../models/stockPruebas");
const buscarAs400 = async (req, res) => {
	const User = req.usuario;
	const { dlnuor } = req.params;
	console.log(`dlnuor`, dlnuor);
	let params = {
		dlnuor: `${dlnuor}`,
		dlunme: "2261000000", //3221400000-2221010000
	};

	const instance = axios.create({
		baseURL: process.env.AS400,
		params,
	});

	const resp = await instance.get();
	const as400 = resp.data;
	console.log(User.rol);
	if (Number(as400.DLCPRO) === 9 && User.rol === "ADMIN") {
		if (as400 && as400.DLCEXAS) {
			const GroupList = await Promise.all(as400.DLCEXAS.map(async (item) => {
				const referenciaObjeto = await Pruebastock.findOne({
					where: { CODIGO: item },
				});
                  
				console.log(`okokokokooooo`, referenciaObjeto.dataValues.IDENTIFICADOR);
				if (referenciaObjeto) {
					return {
						ItemID: referenciaObjeto.dataValues.IDENTIFICADOR,
						ItemName: referenciaObjeto.dataValues.SERVICIO,
					};
				}
				return item;
			}));
			console.log(`group`, GroupList);
			as400.DLCEXAS = GroupList;
		}
		res.status(200).json({ ok: true, data: as400 });
	} else {
		return res.status(200).json({
			ok: true,
			data: `No esta autorizado para ingresar este tipo de ordenes`,
		});
	}
};

module.exports = {
	buscarAs400,
};
