const { Request, Response } = require("express");


const Equipocomplementario = require("../models/equiposcomplementarios");
const Usuario = require("../models/usuarios");

const getequipocomplementario= async (req, res) => {
	const equipocomplementario= await Equipocomplementario.findAll({
		/* where: {
			ESTADO: true,
		}, */
		include:{
			model: Usuario,
			as:"usuario"
		}
	});

	res.json({ ok: true,  equipocomplementario});
};
const getBYIdequipocomplememnatrio=async(req,res)=>{

	const { id } = req.params;
	const equipocomplementarioId = await Equipocomplementario.findByPk(id, );

	if (!equipocomplementarioId) {
		return res.status(400).json({
			ok: false,
			msg: `El id ${id} no existe`,
		});
	}
	res.status(200).json({
		ok: true,
		equipocomplementarioId,
	});

}




const GetfiltroEquipCom = async (req, res) => {
	const { busquedaequipcom } = req.params;

	const dataCA = busquedaequipcom.replace(/\w\S*/g, function (e) {
		return e.charAt(0).toUpperCase() + e.substring(1);
	});

	const equipocomplementario = await Equipocomplementario.findAll({
		where: {
			equipo: {
				[Op.like]: `%${dataCA}%`,
			},
		},
	});

	res.status(200).json({ ok: true, equipocomplementario });
};
const createequipocomplementario= async (req, res) => {
	const { equipo } = req.body;
	const user = req.usuario;
	const equipocomplementario= new Equipocomplementario({ equipo ,CREATEDBY: user.id,
		usuarioId: user.id,});
	const mar = await Equipocomplementario.findOne({
		where: {
			equipo:equipo,
		},
	});

	if (mar) {
		return res.status(400).json({
			msg: "El nombre ya se encuentra registrado ",
		});
	}
	await equipocomplementario.save();
	res.status(201).json({ msg: `Se  ha  registrado con exito ${equipo}` });
};

const updateequipocomplementario= async (req, res) => {
	const id = req.body.id;

	const equipocomplementario = await Equipocomplementario.findByPk(id);
	if (!equipocomplementario) {
		return res.status(404).json({ ok: true, msg: "no existe usuario" });
	}

	const { equipo } = req.body;

	await Equipocomplementario.update(
		{
			equipo
		},
		{ where: { id: id } }
	);

	res.status(200).json({ ok: true, msg: `Se actualizo con exito el ${equipo}` });
};

const deleteequipocomplementario= async (req, res) => {
	const {id} = req.params;
	const equipo = await Equipocomplementario.findByPk(id);
	if (!equipo) {
		return res.status(404).json({
			msg: `No existe el complemento con el id ${id}`,
		});
	}

	await equipo.update({ estado: 0 });

	res.status(200).json({
		msg: "El complemento a sido desactivado con exito...",
	});
};

module.exports = {
	getequipocomplementario,
	getBYIdequipocomplememnatrio,
    createequipocomplementario,
	GetfiltroEquipCom,
    updateequipocomplementario,
    deleteequipocomplementario
};
