const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");

class PedidoStock extends Model {}

PedidoStock.init(
	{
		AREA: {
			type: DataTypes.INTEGER,
		},

		FECHAPEDIDOSTOCK: {
			type: Sequelize.DATE,
			allowNull: false,
			defaultValue: Sequelize.NOW,
		},
		fechaDespacho:{
        type:DataTypes.DATE,
		allowNull: true,
		},
		fechaRecibe:{
			type:DataTypes.DATE,
			allowNull: true,
			},
		ESTADO: { type: DataTypes.INTEGER, defaultValue: 1 },

	},
	{
		sequelize,
		modelName: "pedidostock",
	}
);
module.exports = PedidoStock;
