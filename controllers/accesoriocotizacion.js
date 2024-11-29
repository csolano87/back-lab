const { Request, Response } = require("express");

const Roles = require("../models/role");
const { Op, where } = require("sequelize");

const Accesocotizacion = require("../models/accesoriocotizacion");
const { upperCase } = require("lodash");

const GetAccesoriocotizacion = async (req, res) => {
	const accesorio = await Accesocotizacion.findAll({
	
	});
accesorio.sort(function(a,b){
	if (a.NOMBRE > b.NOMBRE) {
		return 1;
	  } else if (a.NOMBRE < b.NOMBRE) {
		return -1;
	  } else {
		return 0;
	  }
})
	res.json({ ok: true, accesorio });
};

const GetIdAccesoriocotizacion = async (req, res) => {
	res.json({ usuarios });
};

const postAccesoriocotizacion = async (req, res) => {
	const {CODIGO, NOMBRE } = req.body;

	const accesorios = new Accesocotizacion({ CODIGO,NOMBRE });
	const accesorio = await Accesocotizacion.findOne({
		where: {
			NOMBRE: NOMBRE,
		},
	});

	console.log(accesorio);

	if (accesorio) {
		return res.status(400).json({
			msg: "El accesorio  ya existe",
		});
	}

	await accesorios.save();
	res.status(201).json({ msg: "El accesorio   a sido registrado con exito" });
};

const UpdateAccesoriocotizacion = async (req, res) => {
	res.send("update guardada con exito..");
};

const DeleteAccesoriocotizacion = async (req, res) => {
	const id = req.params.id;
	const { CODIGO,NOMBRE } = req.body;
	const accesorio = await Accesocotizacion.findByPk(id);
	if (!accesorio) {
		return res.status(404).json({
			msg: "El accesorio  no existe...",
		});
	}
	await accesorio.update({
		ESTADO:0 }
	);

	res.status(200).json({
		msg: `El nombre ${NOMBRE} a sido desactivado con exito...`,
	});
};

module.exports = {
	DeleteAccesoriocotizacion,
	UpdateAccesoriocotizacion,
	GetAccesoriocotizacion,
	postAccesoriocotizacion,
	GetIdAccesoriocotizacion,
};
