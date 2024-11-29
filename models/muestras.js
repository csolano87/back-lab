


const { DataTypes, Sequelize, Model } = require("sequelize");

const sequelize = require("../db/connection");


class Muestra extends Model {}

Muestra.init({

    nombre:{
        type:DataTypes.STRING
    },
  /*   USUARIO_ID: DataTypes.INTEGER,
    CREATEDBY:DataTypes.INTEGER,
    UPDATEDBY:DataTypes.INTEGER,
    DELETEDBY:DataTypes.INTEGER, */
	estado: { type: DataTypes.BOOLEAN, defaultValue: true },

},
{
    sequelize,
    modelName:"muestras"
});
module.exports=Muestra