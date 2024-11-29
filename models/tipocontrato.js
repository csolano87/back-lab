const { Model, DataTypes,Sequelize } = require("sequelize");
const sequelize = require("../db/connection");
class Tipocontrato extends Model {}

Tipocontrato.init(
	{
		NOMBRE: DataTypes.STRING,
		USUARIO_ID: DataTypes.INTEGER,
    CREATEDBY:DataTypes.INTEGER,
    UPDATEDBY:DataTypes.INTEGER,
    DELETEDBY:DataTypes.INTEGER,
	},
	
	{
		sequelize,
		modelName: "tipocontrato",
	}
);

module.exports = Tipocontrato ;
