const { Model, DataTypes } = require("sequelize");

const sequelize = require("../db/connection");

class Correo extends Model {}
Correo.init(
	{
		nombres: DataTypes.STRING,
		apellidos: DataTypes.STRING,
		correo: DataTypes.STRING,
		empresa: DataTypes.STRING,
		USUARIO_ID: DataTypes.INTEGER,
		CREATEDBY: DataTypes.INTEGER,
		UPDATEDBY: DataTypes.INTEGER,
		DELETEDBY: DataTypes.INTEGER,
		estado: { 
			type: DataTypes.BOOLEAN,
			defaultValue: 1,
		},
	},
	{
		sequelize,
		modelName: "correos",
	}
);
module.exports = Correo;
