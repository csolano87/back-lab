const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");

class Cabecera extends Model {}
Cabecera.init(
  {
    DLCBEN: DataTypes.STRING,
    DLCACT: DataTypes.STRING,
    DLCDEP: DataTypes.INTEGER,
    DLCOTR: DataTypes.STRING,
    DLCEDU: { type: DataTypes.STRING, allowNull: true },
    DLCPRO: DataTypes.STRING,
    DLCSER: { type: DataTypes.STRING, allowNull: true },
    DLCMED: { type: DataTypes.STRING, allowNull: true },   
    DLNUOR: DataTypes.STRING,
    DLAPEL: { type: DataTypes.STRING, allowNull: true },
    DLNOMB: { type: DataTypes.STRING, allowNull: true, defaultValue: null },//
    DLSEXO: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    DLFECN: { type: DataTypes.STRING, allowNull: true },
    DLHIST: { type: DataTypes.STRING, allowNull: true },
    DLTIDO: { type: DataTypes.STRING, allowNull: true },       
    DLCDIS:{type:DataTypes.STRING,allowNull:true},    //

    FECHA: { type: DataTypes.STRING, allowNull: true },
    CODIMPRESORA: { type: DataTypes.STRING, allowNull: true },
    NUMEROORDEN: DataTypes.STRING,
    FECHAORDEN: {
      type: Sequelize.DATEONLY,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    HORAORDEN: {
      type: Sequelize.TIME,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    HORATOMA: { type: DataTypes.TIME, allowNull: true },
    FECHATOMA: { type: DataTypes.DATE, allowNull: true },
    //borrar sexo
    SEXO: DataTypes.STRING,
    USUARIO_ID: DataTypes.INTEGER,
    USUARIO_ID: DataTypes.INTEGER,
    CREATEDBY:DataTypes.INTEGER,
    UPDATEDBY:DataTypes.INTEGER,
    DELETEDBY:DataTypes.INTEGER,
    ESTADO: { type: DataTypes.INTEGER, defaultValue: 1 },
  },

  {
    sequelize,
    modelName: "cabecera",
  },
);
module.exports = Cabecera;
