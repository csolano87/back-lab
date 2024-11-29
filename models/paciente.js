const { Model, DataTypes } = require("sequelize");

const sequelize = require('../db/connection')

class Paciente extends Model {}
Paciente.init({
	tipo: DataTypes.STRING,
	numero: DataTypes.STRING,
	apellidos: DataTypes.STRING,
	nombres: DataTypes.STRING,
	fechanac: DataTypes.DATE,
	edad: DataTypes.INTEGER,
	email: DataTypes.STRING,
	sexo: DataTypes.STRING,
	convencional: DataTypes.INTEGER,
	celular: DataTypes.INTEGER,
	provincia: DataTypes.INTEGER,
	canton: DataTypes.INTEGER,
	parroquia: DataTypes.INTEGER,
	barrio: DataTypes.STRING,
	numeracion: DataTypes.STRING,
	USUARIO_ID: DataTypes.INTEGER,
    CREATEDBY:DataTypes.INTEGER,
    UPDATEDBY:DataTypes.INTEGER,
    DELETEDBY:DataTypes.INTEGER,
	estado:{
		type:DataTypes.BOOLEAN,
		defaultValue:true
	}
},
{
    sequelize,
    modelName:"pacientes"
});

module.exports = Paciente;
