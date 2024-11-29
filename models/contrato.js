const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");

class Contrato  extends Model {}

Contrato.init(
  {
    
    NOMBRE: {
      type: DataTypes.STRING,
    },
    USUARIO_ID: DataTypes.INTEGER,
    CREATEDBY:DataTypes.INTEGER,
    UPDATEDBY:DataTypes.INTEGER,
    DELETEDBY:DataTypes.INTEGER,

    USUARIO_ID: DataTypes.INTEGER,
   

    ESTADO: { type: DataTypes.INTEGER, defaultValue: 1 },
  },
  {
    sequelize,
    modelName: "contrato",
  },
);
module.exports = Contrato;