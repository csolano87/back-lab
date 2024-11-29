const { Model, DataTypes } = require("sequelize");

const sequelize = require('../db/connection')

class Medico extends Model {}
Medico.init({
	
	numero: DataTypes.STRING,
	apellidos: DataTypes.STRING,
	nombres: DataTypes.STRING,	
	email: DataTypes.STRING,
    especialidad: DataTypes.INTEGER,
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
    modelName:"medicos"
});

module.exports = Medico;
