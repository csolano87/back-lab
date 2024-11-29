const { DataTypes, Model } = require("sequelize");
const sequelize = require("../db/connection");

class Detalle_Agen extends Model {}
Detalle_Agen.init(
  {
    ItemID: DataTypes.INTEGER,
    ItemName: DataTypes.STRING,
    ExamID: DataTypes.STRING,
    USUARIO_ID: DataTypes.INTEGER,
    CREATEDBY:DataTypes.INTEGER,
    UPDATEDBY:DataTypes.INTEGER,
    DELETEDBY:DataTypes.INTEGER,
    ESTADO: { type: DataTypes.INTEGER, defaultValue: 1 },
  },
  {
    sequelize,
    modelName: "detalle_agen",
  },
);

module.exports = Detalle_Agen;
