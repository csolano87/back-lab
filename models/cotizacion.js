const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");

class Cotizacion extends Model {}

Cotizacion.init(
	{
		RAZONSOCIAL: DataTypes.STRING,
		RUC: DataTypes.STRING,
		CORREO: DataTypes.STRING,
		//MODALIDAD: DataTypes.INTEGER,
        ESTADISTICA:DataTypes.BOOLEAN,
        CARGA:DataTypes.STRING,
        COMENTARIOS:DataTypes.STRING,
		USUARIO_ID: DataTypes.INTEGER,
    CREATEDBY:DataTypes.INTEGER,
    UPDATEDBY:DataTypes.INTEGER,
    DELETEDBY:DataTypes.INTEGER,
		ESTADO: { type: DataTypes.INTEGER, defaultValue: 1 },
	},
	{
		sequelize,
		modelName: "cotizacions",
	}
);
module.exports = Cotizacion;