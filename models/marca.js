const { Sequelize, DataTypes, Model } = require("sequelize");

const sequelize = require("../db/connection");

class Marca extends Model {}
Marca.init(
	{
		NOMBRE: { type: DataTypes.STRING },
		ESTADO: { type: DataTypes.INTEGER, defaultValue: 1 },
		USUARIO_ID: DataTypes.INTEGER,
    CREATEDBY:DataTypes.INTEGER,
    UPDATEDBY:DataTypes.INTEGER,
    DELETEDBY:DataTypes.INTEGER,
	},
	{
		sequelize,
		modelName: "marca",
	}
);

module.exports = Marca;
