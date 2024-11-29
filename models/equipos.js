const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");

class Equipos extends Model {}

Equipos.init(
	{
		/* NOMBRE: { type: DataTypes.STRING },
		CATEGORIA: { type: DataTypes.STRING },
		USUARIO_ID: { type: DataTypes.STRING },
		MARCA_ID: { type: DataTypes.INTEGER },
		MODELO_ID: { type: DataTypes.INTEGER }, */
		SERIE: { type: DataTypes.STRING },
		fecha:{type:DataTypes.DATE},
		USUARIO_ID: DataTypes.INTEGER,
		CREATEDBY: DataTypes.INTEGER,
		UPDATEDBY: DataTypes.INTEGER,
		DELETEDBY: DataTypes.INTEGER,
		ESTADO: { type: DataTypes.INTEGER, defaultValue: 1 },
	},
	{
		sequelize,
		modelName: "equipos",
	}
);
module.exports = Equipos;
