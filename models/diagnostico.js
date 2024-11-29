
const { DataTypes, Sequelize, Model } = require("sequelize");

const sequelize = require("../db/connection");


class Diagnostico extends Model {}

Diagnostico.init({

    nombre:{
        type:DataTypes.STRING
    },
    USUARIO_ID: DataTypes.INTEGER,
    CREATEDBY:DataTypes.INTEGER,
    UPDATEDBY:DataTypes.INTEGER,
    DELETEDBY:DataTypes.INTEGER,
	estado: { type: DataTypes.BOOLEAN, defaultValue: true },

},
{
    sequelize,
    modelName:"diagnosticos"
});

module.exports=Diagnostico;