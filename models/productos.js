const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");

class Producto extends Model {}

Producto.init(
	{
		REFERENCIA: {
			type: DataTypes.STRING,
			//unique: true,
		},
		NOMBRE: {
			type: DataTypes.STRING,
		},
		CATEGORIA: {
			type: DataTypes.STRING,allowNull: true
		},
		UNIDAD: { type: DataTypes.STRING,allowNull: true },
		GENERACION: { type: DataTypes.STRING ,allowNull: true},
		VALOR: { type: DataTypes.DOUBLE,allowNull: true },
		USUARIO_ID: DataTypes.INTEGER,
		CREATEDBY: DataTypes.INTEGER,
		UPDATEDBY: DataTypes.INTEGER,
		DELETEDBY: DataTypes.INTEGER,
		ESTADO: { type: DataTypes.INTEGER, defaultValue: 1 },
	},
	{
		sequelize,
		modelName: "producto",
	}
);
module.exports = Producto;
