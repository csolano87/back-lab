const { Request, Response } = require("express");

const Roles = require("../models/role");
const { Op, where } = require("sequelize");
const Modelo = require("../models/modelo");
const Equipos = require("../models/equipos");
const Analizador = require("../models/analizador");
const Marca = require("../models/marca");
const Usuario = require("../models/usuarios");
const Rango = require("../models/rangosreferencia");
const Panel_pruebas = require("../models/panelPruebas");
const Unidad = require("../models/unidad");
const Tipofisiologico = require("../models/tipofisiologico");
const Unidadedad = require("../models/unidadedad");

const consultarangoreferencia = async (req, res) => {
	const rangos = await Rango.findAll({
		include: [
			{
				model: Panel_pruebas,
				as: "panelpruebas",
              //  where: panelpruebasId ? { panelpruebasId: { [Op.eq]: id } } : {}, 
			},
			{ model: Unidad, as: "unidad" },
			{ model: Tipofisiologico, as: "tipofisiologico" },
			{ model: Unidadedad, as: "unidadedad" },
		],
	});
	res.json({ ok: true, rangos });
};

const GetIDrangoreferencia = async (req, res) => {
	const { id } = req.params;
	const rangosId = await Rango.findAll(
        
      {
        where:{ panelpruebasId:id} ,
        include: [
			{
				model: Panel_pruebas,
				as: "panelpruebas",
               
			},
			{ model: Unidad, as: "unidad" },
			{ model: Tipofisiologico, as: "tipofisiologico" },
			{ model: Unidadedad, as: "unidadedad" },
		],
    });

	if (!rangosId) {
		return res.status(400).json({
			ok: false,
			msg: `El id ${id} no existe`,
		});
	}
	res.status(200).json({
		ok: true,
		rangosId,
	});
};

const Getfiltrorangoreferencia = async (req, res) => {
	const { busquedamodelo } = req.params;

	const dataCA = busquedamodelo.replace(/\w\S*/g, function (e) {
		return e.charAt(0).toUpperCase() + e.substring(1);
	});

	const rangoreferencia = await Rango.findAll({
		where: {
			NOMBRE: {
				[Op.like]: `%${dataCA}%`,
			},
		},
	});

	res.status(200).json({ ok: true, rangoreferencia });
};

const postrangoreferencia = async (req, res) => {
	const {
		panelpruebasId,
		tipofisiologicoId,

		rangos,
		unidadId,
		edadinicial,
		unidadedadId,
		edadfinal,
		unidadfinalId,
		comentario,
	} = req.body;
	const user = req.usuario;
	const rangoreferenciaes = new Rango({
		panelpruebasId,
		panelpruebasId:panelpruebasId,
		tipofisiologicoId,
		rangos,
		unidadId,
		edadinicial,
		unidadedadId,
		edadfinal,
		unidadfinalId,
		comentario,
		usuarioId: user.id,
	});

	await rangoreferenciaes.save();
	res.status(201).json({ msg: "Se registro con exito la referencia" });
};

const rangoreferenciaUpdate = async (req, res) => {
	const {id}=req.params;
	const {
		panelpruebasId,
		tipofisiologicoId,

		rangos,
		unidadId,
		edadinicial,
		unidadedadId,
		edadfinal,
		unidadfinalId,
		comentario,
	} = req.body;
	console.log(`*****************`,req.body)
	const rangoreferenciaBD = await Rango.findByPk(id);
	if (!rangoreferenciaBD) {
		return res.status(404).json({
			ok: false,
			msg: `No existe el rango ingresado`,
		});
	}
	await Rango.update(
		{
			panelpruebasId,
			panelpruebaId:panelpruebasId,
			tipofisiologicoId,
			rangos,
			unidadId,
			edadinicial,
			unidadedadId,
			edadfinal,
			unidadfinalId,
			comentario,
		},
		{ where: { id: id } }
	);

	res.status(200).json({
		ok: true,
	 
		msg: `Se actualizo con exito los datos del usuario` 
	});
};

const rangoreferenciaDelete = async (req, res) => {
	const { id } = req.params;
	const rangoreferencia = await Rango.findByPk(id);

	 if (!rangoreferencia) {
		return res
			.status(404)
			.json({ ok: false, msg: `La rango referencia ingresado no existe` });
	}
	await rangoreferencia.update({ ESTADO: 0 });
	res.status(200).json({
		msg: `El rango de referencia ${rangoreferencia.rangos} a sido desactivado con exito...`,
	}); 
};

module.exports = {
	rangoreferenciaDelete,
	rangoreferenciaUpdate,
	consultarangoreferencia,
	postrangoreferencia,
	Getfiltrorangoreferencia,
	GetIDrangoreferencia,
};
