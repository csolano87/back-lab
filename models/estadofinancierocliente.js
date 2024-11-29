const { DataTypes, Sequelize, Model } = require("sequelize");

const sequelize = require("../db/connection");


class Estadofinancierocliente extends Model {}

Estadofinancierocliente.init({

    NOMBRE:{
        type:DataTypes.STRING
    },
    USUARIO_ID: DataTypes.INTEGER,
    CREATEDBY:DataTypes.INTEGER,
    UPDATEDBY:DataTypes.INTEGER,
    DELETEDBY:DataTypes.INTEGER,
	ESTADO: { type: DataTypes.INTEGER, defaultValue: 1 },

},
{
    sequelize,
    modelName:"Estadofinancieroclientes"
});
module.exports=Estadofinancierocliente