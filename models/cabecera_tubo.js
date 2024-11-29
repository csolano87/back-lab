const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");

class Cabecera_Tubo extends Model {
  /*  static associate(models){
        Cabecera.belongsTo(models.Detalle,{
            foreingkey:'idcabecera'})
    } */
}
Cabecera_Tubo.init(
  {
    //CODPROCEDENCIA: DataTypes.INTEGER,
    USUARIO_ID: DataTypes.INTEGER,
    CREATEDBY:DataTypes.INTEGER,
    UPDATEDBY:DataTypes.INTEGER,
    DELETEDBY:DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: "Cabecera_Tubo",
  },
);
module.exports = Cabecera_Tubo;
