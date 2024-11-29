

const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");

class Itemcotizacion extends Model {}

Itemcotizacion.init(
	{
		itemAnalizador:DataTypes.INTEGER,
		//nombreAnalizador: DataTypes.STRING,
		idEquipo: DataTypes.INTEGER,
		
		//nombreEquipo: DataTypes.STRING,
		
		CANTIDAD:DataTypes.INTEGER,
		USUARIO_ID: DataTypes.INTEGER,
    CREATEDBY:DataTypes.INTEGER,
    UPDATEDBY:DataTypes.INTEGER,
    DELETEDBY:DataTypes.INTEGER,
		ESTADO: { type: DataTypes.BOOLEAN, defaultValue: true },
	},
	{
		sequelize,
		modelName: "itemcotizacions",
	}
);
module.exports = Itemcotizacion;
