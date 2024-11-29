const { DataTypes, Model } = require("sequelize");
const sequelize = require("../db/connection");

class Servicio extends Model {}
Servicio.init(
  {
    DLCPRO: DataTypes.STRING,
    NOMBRE: DataTypes.STRING,
    //ESTADO: { type: DataTypes.INTEGER, defaultValue: 1 },
    USUARIO_ID: DataTypes.INTEGER,
    CREATEDBY:DataTypes.INTEGER,
    UPDATEDBY:DataTypes.INTEGER,
    DELETEDBY:DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: "servicio",
  },
);

module.exports = Servicio;
