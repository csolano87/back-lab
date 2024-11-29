const { Model, DataTypes } = require("sequelize");
const sequelize= require("../db/connection")

class Historicoubicacion extends Model{}
Historicoubicacion.init({    
    fecha: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
    },
    hora: {
        type: DataTypes.TIME,
        allowNull: true,
        defaultValue: DataTypes.NOW,
    },
   // fecha_cambio: new Date(),
},
{
    sequelize,
    modelName: "historicoubicacions",
    
})
module.exports= Historicoubicacion;