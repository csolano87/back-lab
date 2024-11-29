const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../db/connection");
class Pruebastock extends Model {}

Pruebastock.init(
	{
		GRUPO: {
			type: DataTypes.STRING,
		},
		IDENTIFICADOR: {
			type: DataTypes.STRING,
		},
		CODIGO: {
			type: DataTypes.STRING,
		},
		SERVICIO: {
			type: DataTypes.TEXT,
		},
		USUARIOID: {
			type: DataTypes.INTEGER,
		},
		USUARIO_ID: DataTypes.INTEGER,
		CREATEDBY: DataTypes.INTEGER,
		UPDATEDBY: DataTypes.INTEGER,
		DELETEDBY: DataTypes.INTEGER,
		ESTADO: { type: DataTypes.INTEGER, defaultValue: 1 },
	},
	{
		sequelize,
		modelName: "pruebastock",
	}
);

module.exports = Pruebastock;
