const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");

class Solicitudrepuesto extends Model {}

Solicitudrepuesto.init(
	{
		NOMBRE: {
			type: DataTypes.STRING,
		},
		REPARACION_ID: DataTypes.INTEGER,
		
		USUARIO_ID: DataTypes.INTEGER,
		CREATEDBY:DataTypes.INTEGER,
		UPDATEDBY:DataTypes.INTEGER,
		DELETEDBY:DataTypes.INTEGER,
		USUARIO_ID: DataTypes.INTEGER,

		ESTADO: { type: DataTypes.INTEGER, defaultValue: 1 },
	},
	{
		sequelize,
		modelName: "Solicitudrepuesto",
	}
);
module.exports = Solicitudrepuesto;
