const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");

class Panel_pruebas extends Model {}

Panel_pruebas.init(
	{
		CODIGO: {
			type: DataTypes.STRING,
		},
		ABREV: {
			type: DataTypes.STRING,
		},
		ORDEN: {
			type: DataTypes.INTEGER,
		},
		NOMBRE: {
			type: DataTypes.STRING,
		},
		/* CATEGORIA: {
			type: DataTypes.STRING,
		}, */
		/* ordenamiento: {
			type: DataTypes.INTEGER,
		}, */
		TIEMPO: {
			type: DataTypes.INTEGER,
		},
		VALOR: {
			type: DataTypes.FLOAT,
		},
		CODEXTERNO: {
			type: DataTypes.INTEGER,
		},
		favorite: DataTypes.BOOLEAN,
		ESTADO: { type: DataTypes.INTEGER, defaultValue: 1 },
		USUARIO_ID: DataTypes.INTEGER,
		CREATEDBY: DataTypes.INTEGER,
		UPDATEDBY: DataTypes.INTEGER,
		DELETEDBY: DataTypes.INTEGER,
	},
	{
		sequelize,
		modelName: "panel_prueba",
	}
);
module.exports = Panel_pruebas;
