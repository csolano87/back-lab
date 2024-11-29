const Paciente = require("../models/paciente");

const getPaciente = async (req, res) => {
	const pacientes = await Paciente.findAll();
	res.status(200).json({ ok: true, pacientes });
};

const getIdPaciente = async (req, res) => {
	const { id } = req.params;
	const pacientes = await Paciente.findByPk(id);
	if (!paciente) {
		res.status(400).json({ ok: true, msg: `El ID ${id} no existe` });
	}
	//const pacientes = await Paciente.findAll();
	res.status(200).json({ ok: true, pacientes });
};
const postPaciente = async (req, res) => {


	const {
		tipo,
		numero,
		apellidos,
		nombres,
		fechanac,
		edad,
		email,
		sexo,
		convencional,
		celular,
		provinciaId,
		cantonId,
		parroquiaId,
		barrio,
		numeracion,
	} = req.body;

   
	const pacientes = new Paciente({
		tipo,
		numero,
		apellidos,
		nombres,
		fechanac,
		edad,
		email,
		sexo,
		convencional,
		celular,
		provincia:provinciaId,
		canton:cantonId,
		parroquia:parroquiaId,
		barrio,
		numeracion}
	);
    console.log(pacientes.numero)
	const paciente = await Paciente.findOne({
		where: { numero: pacientes.numero },
	});

	if (paciente) {
	return 	res
			.status(400)
			.json({ ok: true, msg: `El paciente con numero ${numero} ya  existe` });
	}
	await pacientes.save();

	res.status(201).json({
		ok: true,
		msg: `Se creado con exito el paciente ${apellidos} ${nombres}`,
	});
};
const updatePaciente = (req, res) => {};
const deletePaciente = async (req, res) => {
	const { id } = req.params;
	const pacientes = await Paciente.findByPk(id);
	if (!paciente) {
		res.status(400).json({ ok: true, msg: `El ID ${id} no existe` });
	}
	await Paciente.update({ estado: false },{id:id});
	//const pacientes = await Paciente.findAll();
	res.status(200).json({ ok: true, msg: `El paciente a sido desactivado` });
};

module.exports = {
	getPaciente,
	getIdPaciente,
	postPaciente,
	updatePaciente,
	deletePaciente,
};
