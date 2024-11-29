const { DataTypes, Model } = require("sequelize");
const sequelize = require("../db/connection");

class Detalle extends Model {}
Detalle.init(
  {
    ItemID: DataTypes.INTEGER,
    ItemName: DataTypes.STRING,
    USUARIO_ID: DataTypes.INTEGER,
    CREATEDBY:DataTypes.INTEGER,
    UPDATEDBY:DataTypes.INTEGER,
    DELETEDBY:DataTypes.INTEGER,
    ESTADO: { type: DataTypes.BOOLEAN },
  },
  {
    sequelize,
    modelName: "detalle",
  },
);

module.exports = Detalle;
