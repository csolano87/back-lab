const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");

class Accesorio extends Model {}

Accesorio.init(
	{
		//ACCMODELO_ID: DataTypes.STRING,
		DESCRIPCION: DataTypes.STRING,
		MARCA: DataTypes.STRING,

		SERIEACC: DataTypes.STRING,
		USUARIO_ID: DataTypes.INTEGER,
		USUARIO_ID: DataTypes.INTEGER,
		CREATEDBY: DataTypes.INTEGER,
		UPDATEDBY: DataTypes.INTEGER,
		DELETEDBY: DataTypes.INTEGER,
		ESTADO: { type: DataTypes.INTEGER, defaultValue: 1 },
	},
	{
		sequelize,
		modelName: "accesorio",
	}
);
module.exports = Accesorio;
