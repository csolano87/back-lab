const { DataTypes, Model } = require("sequelize");
const sequelize = require("../db/connection");

class Estadoproceso extends Model {}

Estadoproceso.init(
	{
		ESATADO: DataTypes.INTEGER,
		USUARIO_ID: DataTypes.INTEGER,
    CREATEDBY:DataTypes.INTEGER,
    UPDATEDBY:DataTypes.INTEGER,
    DELETEDBY:DataTypes.INTEGER,
	},
	{
		sequelize,
		modelName: "estadoproceso",
	}
);

module.exports = Estadoproceso;
