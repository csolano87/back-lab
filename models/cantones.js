const { Model, DataTypes } = require("sequelize");
const sequelize = require("../db/connection");

class Canton extends Model {}

Canton.init(
	{
        canton:DataTypes.STRING,
		USUARIO_ID: DataTypes.INTEGER,
    CREATEDBY:DataTypes.INTEGER,
    UPDATEDBY:DataTypes.INTEGER,
    DELETEDBY:DataTypes.INTEGER,
        estado:{type:DataTypes.BOOLEAN, defaultValue:true}
        
    },
	{
		sequelize,
		modelName: "cantons",
	}
);
module.exports = Canton;
