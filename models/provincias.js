const { Sequelize, DataTypes, Model } = require("sequelize");
const db = require("../db/connection");
//const Cabecera = require('./cabecera');

const Provincia = db.define(
  "Provincia",
  {
    descripcion: {
      type: DataTypes.STRING,
      //required:[true,'El rol es obligatorio']
    },
    USUARIO_ID: DataTypes.INTEGER,
    CREATEDBY:DataTypes.INTEGER,
    UPDATEDBY:DataTypes.INTEGER,
    DELETEDBY:DataTypes.INTEGER,
  },
  {
    freezeTableName: true,
    tableName: "provincia",
    timestamps: false,
  },
);
module.exports = Provincia;
