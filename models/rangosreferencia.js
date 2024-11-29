const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");

class Rango extends Model {}
Rango.init(
	{
		//tipofisiologico: DataTypes.INTEGER,
		rangos: DataTypes.STRING,
		//unidad: DataTypes.STRING,
		edadinicial: DataTypes.INTEGER,
		//unidadedadinicial: DataTypes.STRING,
		edadfinal: DataTypes.INTEGER,
		//unidadedadfinal: DataTypes.STRING,
		comentario: DataTypes.TEXT("long"),

		usuarioId: DataTypes.STRING,
		USUARIO_ID: DataTypes.INTEGER,
		CREATEDBY: DataTypes.INTEGER,
		UPDATEDBY: DataTypes.INTEGER,
		DELETEDBY: DataTypes.INTEGER,
		ESTADO: { type: DataTypes.BOOLEAN, defaultValue: true },
	},

	{
		sequelize,
		modelName: "rango",
	}
);
module.exports = Rango;
