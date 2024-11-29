const { Sequelize, DataTypes, Model } = require("sequelize");

const sequelize = require("../db/connection");

class Cliente extends Model {}
Cliente.init({
	NOMBRE: { type: DataTypes.STRING },
    USUARIO_ID: DataTypes.INTEGER,
    CREATEDBY:DataTypes.INTEGER,
    UPDATEDBY:DataTypes.INTEGER,
    DELETEDBY:DataTypes.INTEGER,
    
    ESTADO: { type: DataTypes.INTEGER, defaultValue: 1 },
},
{
    sequelize,
    modelName:"cliente"
});

module.exports=Cliente;
