const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");

class Estado  extends Model {}

Estado.init(
  {
    
    NOMBRE: {
      type: DataTypes.STRING,
    },
    color:DataTypes.STRING,

   // USUARIO_ID: DataTypes.INTEGER,
    USUARIO_ID: DataTypes.INTEGER,
    CREATEDBY:DataTypes.INTEGER,
    UPDATEDBY:DataTypes.INTEGER,
    DELETEDBY:DataTypes.INTEGER,

    ESTADO: { type: DataTypes.INTEGER, defaultValue: 1 },
  },
  {
    sequelize,
    modelName: "estados",
  },
);
module.exports = Estado;