const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");

class Tipomuestra extends Model{}
  Tipomuestra.init(
  {
    codigo:
       DataTypes.STRING,
    
    nombre: 
       DataTypes.STRING,
    
    abreviatura: 
      DataTypes.STRING,
    
  
      USUARIO_ID: DataTypes.INTEGER,
      CREATEDBY:DataTypes.INTEGER,
      UPDATEDBY:DataTypes.INTEGER,
      DELETEDBY:DataTypes.INTEGER,

    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: 1,
    },
  },

  {
   sequelize,
   modelName: "tipomuestras",
   timestamps: false,
  },
);

module.exports = Tipomuestra;
