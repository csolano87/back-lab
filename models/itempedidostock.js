const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");

class Itempedidostock extends Model { }

Itempedidostock.init(
	{
		ID_PRODUCTO: {
			//ID_PRODUCTO
			type: DataTypes.INTEGER,
		},

		CANTIDAD: { type: DataTypes.INTEGER },
		ENTREGADO: { type: DataTypes.INTEGER },

		fecha: {
			type: Sequelize.DATE,
			allowNull: false,
			defaultValue: Sequelize.NOW,
		},

		fechadespachar: {
			type: DataTypes.DATE,
		},
		fechadescargo: {
			type: DataTypes.DATE,
		},
		lote: {
			type: DataTypes.STRING,
		},
		
		ESTADO: { type: DataTypes.INTEGER, defaultValue: 1 },
	},
	{
		sequelize,
		modelName: "itempedidostock",
	}
);
module.exports = Itempedidostock;
