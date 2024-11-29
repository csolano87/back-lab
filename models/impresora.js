const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");
//const Cabecera = require('./cabecera');

class Impresora extends Model {}
Impresora.init(
  {
    NOMBRE: DataTypes.STRING,
    USUARIO_ID: DataTypes.INTEGER,
    CREATEDBY:DataTypes.INTEGER,
    UPDATEDBY:DataTypes.INTEGER,
    DELETEDBY:DataTypes.INTEGER,
    ESTADO: { type: DataTypes.INTEGER, defaultValue: 1 },
  },
  {
    sequelize,
    modelName: "impresora",
  },
);
module.exports = Impresora;
