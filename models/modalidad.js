const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");

class Modalidad  extends Model {}

Modalidad.init(
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
    modelName: "modalidad",
  },
);
module.exports = Modalidad;