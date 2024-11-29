const { Model, DataTypes } = require("sequelize");
const sequelize = require("../db/connection");

class Parroquia extends Model {}

Parroquia.init(
	{

        parroquia:DataTypes.STRING,
		USUARIO_ID: DataTypes.INTEGER,
    CREATEDBY:DataTypes.INTEGER,
    UPDATEDBY:DataTypes.INTEGER,
    DELETEDBY:DataTypes.INTEGER,
        estado:{type:DataTypes.BOOLEAN, defaultValue:true}
    },
	{
		sequelize,
		modelName: "parroquias",
	}
);
module.exports = Parroquia;