const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");

class Tubo extends Model {}
Tubo.init(
  {
    /* descripcion: DataTypes.STRING,
    prueba_id: DataTypes.INTEGER */

    numeroorden: DataTypes.STRING,
    tipoTubo: DataTypes.INTEGER,
    horaIngreso: {
      type: Sequelize.TIME,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },

    fechaIngreso: {
      type: Sequelize.DATEONLY,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    usuarioIngresa: DataTypes.STRING,
    usuarioRechaza: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fechaRechaza: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    horaRechaza: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    fechaUpdate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    horaUpdate: {
      type: DataTypes.TIME,
      allowNull: true,
    },

    usuarioUpdate: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    estado: DataTypes.INTEGER,
    comentario: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    comentarioUpdate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    USUARIO_ID: DataTypes.INTEGER,
    CREATEDBY:DataTypes.INTEGER,
    UPDATEDBY:DataTypes.INTEGER,
    DELETEDBY:DataTypes.INTEGER,
  },

  {
    sequelize,
    modelName: "tubo",
  },
);

module.exports = Tubo;
