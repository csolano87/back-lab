const { Model, DataTypes } = require("sequelize");
const sequelize= require("../db/connection")

class Historicoestado extends Model{}
Historicoestado.init({

    //equipo_id: nuevoEquipo.id,
   // estado_id: DataTypes.INTEGER,
    //ubicacion_id: UBICACION_ID,
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
    modelName: "historicoestados",
    
})
module.exports= Historicoestado;