const { Request, Response } = require("express");


const { Op, where } = require("sequelize");
const Bodega = require("../models/bodega");


const consultabodega = async (req, res) => {
	const bodega = await Bodega.findAll({
	
	});

	res.json({ ok: true, bodega });
};

const GetIDbodega = async (req, res) => {
	
    const {id}=req.params;
    const bodegaId = await Bodega.findByPk(id);
    if (!bodegaId) {
        return res.status(400).json({ok:false, msg:`no existe id ${id}`})
    }
    console.log(`---->`,bodegaId)
    res.status(200).json({ok:true, bodegaId})
};

const postbodega = async (req, res) => {
	const { NOMBRE } = req.body;

	const bodegas = new Bodega({ NOMBRE });
	const bodega = await Bodega.findOne({
		where: {
			NOMBRE: NOMBRE,
		},
	});

	console.log(bodega);

	if (bodega) {
		return res.status(400).json({
			msg: "Este bodega ya existe",
		});
	}

	await bodegas.save();
	res.status(201).json({ msg: "El bodega  a sido registrado con exito" });
};

const bodegaUpdate = async (req, res) => {
	res.send("update guardada con exito..");
};

const bodegaDelete = async (req, res) => {
	const id = req.params.id;
	const { NOMBRE } = req.body;
	const bodega = await Bodega.findByPk(id);
	if (!bodega) {
		return res.status(404).json({
			msg: "El bodega  no existe...",
		});
	}
	await bodega.update({
		ESTADO:0 }
	);

	res.status(200).json({
		msg: `La ${NOMBRE} a sido desactivado con exito...`,
	});
};

module.exports = {
	bodegaDelete,
	bodegaUpdate,
	consultabodega,
	postbodega,
	GetIDbodega,
};
