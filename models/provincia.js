const { Model, DataTypes } = require("sequelize");
const sequelize = require("../db/connection");

class Provincia extends Model {}

Provincia.init(
	{
        provincia:DataTypes.STRING,
		USUARIO_ID: DataTypes.INTEGER,
    CREATEDBY:DataTypes.INTEGER,
    UPDATEDBY:DataTypes.INTEGER,
    DELETEDBY:DataTypes.INTEGER,
        estado:{type:DataTypes.BOOLEAN, defaultValue:true}
        
    },
	{
		sequelize,
		modelName: "provincias",
	}
);
module.exports = Provincia;
