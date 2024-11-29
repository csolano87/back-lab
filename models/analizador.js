const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");

class Analizador extends Model {}

Analizador.init(
	{
		NOMBRE: { type: DataTypes.STRING },

		CARACTERISTICA: { type: DataTypes.TEXT("long") },
		USUARIO_ID: DataTypes.INTEGER,
		CREATEDBY: DataTypes.INTEGER,
		UPDATEDBY: DataTypes.INTEGER,
		DELETEDBY: DataTypes.INTEGER,
		ESTADO: { type: DataTypes.INTEGER, defaultValue: 1 },
	},
	{
		sequelize,
		modelName: "analizadors",
	}
);
module.exports = Analizador;
