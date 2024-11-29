const { DataTypes, Sequelize, Model } = require("sequelize");

const sequelize = require("../db/connection");


class Estadofinancieroproveedor extends Model {}

Estadofinancieroproveedor.init({

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
    modelName:"estadofinancieroproveedors"
});
module.exports=Estadofinancieroproveedor