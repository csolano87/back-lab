const { Model, DataTypes,Sequelize } = require("sequelize");
const sequelize = require("../db/connection");

class Perfil extends Model {}

Perfil.init(
	{
		codigo:DataTypes.INTEGER,
		nombre: DataTypes.STRING,
		tipogrupo: DataTypes.INTEGER,
		USUARIO_ID: DataTypes.INTEGER,
    CREATEDBY:DataTypes.INTEGER,
    UPDATEDBY:DataTypes.INTEGER,
    DELETEDBY:DataTypes.INTEGER,
		estado:{type:DataTypes.BOOLEAN, defaultValue:true}
	},
	{
		sequelize,
		modelName: "perfils",
	}
);

module.exports = Perfil;
