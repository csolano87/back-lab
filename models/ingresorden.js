const { Model, DataTypes } = require("sequelize");

const db = require("../db/connection");

class Ingresorden extends Model {}
Ingresorden.init(
	
	{
		/* tipoatencion: DataTypes.INTEGER,
		servicio: DataTypes.INTEGER, */
		fum: DataTypes.DATE,
		embarazada: DataTypes.BOOLEAN,
	/* 	diagnostico: DataTypes.INTEGER, */
		observaciones: DataTypes.STRING,
		USUARIO_ID: DataTypes.INTEGER,
		CREATEDBY: DataTypes.INTEGER,
		UPDATEDBY: DataTypes.INTEGER,
		DELETEDBY: DataTypes.INTEGER,
		estado:{type:DataTypes.INTEGER, defaultValue:1}
	},
	{
		sequelize,
		modelName: "ingresordens",
	}
);

module.exports = Ingresorden;
