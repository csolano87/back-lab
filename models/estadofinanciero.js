const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");

class Financiero  extends Model {}

Financiero.init(
  {
    
    NOMBRE: {
      type: DataTypes.STRING,
    },
    

    USUARIO_ID: DataTypes.INTEGER,
    USUARIO_ID: DataTypes.INTEGER,
    CREATEDBY:DataTypes.INTEGER,
    UPDATEDBY:DataTypes.INTEGER,
    DELETEDBY:DataTypes.INTEGER,

    ESTADO: { type: DataTypes.INTEGER, defaultValue: 1 },
  },
  {
    sequelize,
    modelName: "financiero",
  },
);
module.exports = Financiero;