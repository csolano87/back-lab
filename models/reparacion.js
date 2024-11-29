const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");

class Reparacion extends Model {}

Reparacion.init(
	{
		NOMBRE: {
			type: DataTypes.STRING,
		},
		EQUIPO_ID: DataTypes.INTEGER,
		FECHAIN: DataTypes.DATE,
		FECHAFIN: DataTypes.DATE,

		USUARIO_ID: DataTypes.INTEGER,
		USUARIO_ID: DataTypes.INTEGER,
		CREATEDBY:DataTypes.INTEGER,
		UPDATEDBY:DataTypes.INTEGER,
		DELETEDBY:DataTypes.INTEGER,
		ESTADO: { type: DataTypes.INTEGER, defaultValue: 1 },
	},
	{
		sequelize,
		modelName: "reparacion",
	}
);
module.exports = Reparacion;
