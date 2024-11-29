const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");

class Tipofisiologico extends Model {}

Tipofisiologico.init(
	{
		DESCRIPCION: DataTypes.STRING,

		USUARIO_ID: DataTypes.INTEGER,
		CREATEDBY: DataTypes.INTEGER,
		UPDATEDBY: DataTypes.INTEGER,
		DELETEDBY: DataTypes.INTEGER,
		ESTADO: { type: DataTypes.BOOLEAN, defaultValue: 1 },
	},
	{
		sequelize,
		modelName: "tipofisiologico",
	}
);
module.exports = Tipofisiologico;
