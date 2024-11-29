const { DataTypes, Sequelize, Model } = require("sequelize");

const sequelize = require("../db/connection");

class Especialidad extends Model {}

Especialidad.init(
	{
		especialidad: {
			type: DataTypes.STRING,
		},
		USUARIO_ID: DataTypes.INTEGER,
    CREATEDBY:DataTypes.INTEGER,
    UPDATEDBY:DataTypes.INTEGER,
    DELETEDBY:DataTypes.INTEGER,
		estado: { type: DataTypes.BOOLEAN, defaultValue: true },
	},
	{
		sequelize,
		modelName: "especialidads",
	}
);

module.exports = Especialidad;