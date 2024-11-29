const { Model, DataTypes } = require("sequelize");
const sequelize =require("../db/connection");


class Equipocomplementario extends Model {}

Equipocomplementario.init({
 equipo:DataTypes.STRING,
 USUARIO_ID: DataTypes.INTEGER,
    CREATEDBY:DataTypes.INTEGER,
    UPDATEDBY:DataTypes.INTEGER,
    DELETEDBY:DataTypes.INTEGER,
 estado:{type:DataTypes.BOOLEAN, defaultValue:true}


},
{
    sequelize,
    modelName:"equipocomplementarios"
});

module.exports=Equipocomplementario;