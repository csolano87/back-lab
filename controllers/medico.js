const Medico = require("../models/medico");

const getMedico = async (req, res) => {
	const medicos = await Medico.findAll();
	res.status(200).json({ ok: true, medicos });
};

const getIdMedico = async (req, res) => {
	const { id } = req.params;
	const medicos = await Medico.findByPk(id);
	if (!medicos) {
		res.status(400).json({ ok: true, msg: `El ID ${id} no existe` });
	}
	//const pacientes = await Paciente.findAll();
	res.status(200).json({ ok: true, medicos });
};
const postMedico = async (req, res) => {
	const {
		numero,
		apellidos,
		nombres,

		email,
		espacialidadId,
		sexo,
		convencional,
		celular,
		provinciaId,
		cantonId,
		parroquiaId,
		barrio,
		numeracion,
	} = req.body;

	const medicos = new Medico({
		numero,
		apellidos,
		nombres,

		email,
		espacialidadId,
		sexo,
		convencional,
		celular,
		provinciaId,
		cantonId,
		parroquiaId,
		barrio,
		numeracion,
	});

	const medico = await Medico.findOne({
		where: { numero: medicos.numero },
	});

	if (medico) {
		return res
			.status(400)
			.json({ ok: true, msg: `El medico con numero ${numero} ya  existe` });
	}
	await medicos.save();

	res.status(201).json({
		ok: true,
		msg: `Se creado con exito el medico ${apellidos} ${nombres}`,
	});
};
const updateMedico = async (req, res) => {};
const deleteMedico = async (req, res) => {
	const { id } = req.params;
	const medicos = await Medico.findByPk(id);
	if (!medicos) {
		res.status(400).json({ ok: true, msg: `El ID ${id} no existe` });
	}
	await Medico.update({ estado: false },{id:id});
	//const pacientes = await Paciente.findAll();
	res.status(200).json({ ok: true, msg: `El paciente a sido desactivado` });
};

module.exports = {
	getMedico,
	getIdMedico,
	postMedico,
	updateMedico,
	deleteMedico,
};
