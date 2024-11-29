const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");

class Solicitud_Proceso extends Model {}

Solicitud_Proceso.init(
  {       
    USUARIO_ID: DataTypes.INTEGER,
    PROCESO_ID: DataTypes.INTEGER,
    MODALIDAD_ID: DataTypes.INTEGER,
    FECHAENTREGA: DataTypes.DATE,
    OBSERVACIONES: DataTypes.STRING,
    USUARIO_ID: DataTypes.INTEGER,
    CREATEDBY:DataTypes.INTEGER,
    UPDATEDBY:DataTypes.INTEGER,
    DELETEDBY:DataTypes.INTEGER,
    ESTADO: { type: DataTypes.INTEGER, defaultValue: 1 },
  },
  {
    sequelize,
    modelName: "Solicitud_procesos",
  },
);
module.exports = Solicitud_Proceso;