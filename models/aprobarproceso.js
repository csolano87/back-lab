const { Model, DataTypes } = require("sequelize");

const sequelize= require("../db/connection")



class Aprobar extends Model{}

Aprobar.init({

    PROCESO_ID:DataTypes.INTEGER,
    USUARIO_ID:DataTypes.INTEGER,
    ESTADOBI: DataTypes.INTEGER ,
    USUARIO_ID: DataTypes.INTEGER,
    CREATEDBY:DataTypes.INTEGER,
    UPDATEDBY:DataTypes.INTEGER,
    DELETEDBY:DataTypes.INTEGER,
},
{
    sequelize,
    modelName:"Aprobar",
});
module.exports=Aprobar;