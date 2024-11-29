const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");

class PedidoStock extends Model {}

PedidoStock.init(
	{
		AREA: {
			type: DataTypes.INTEGER,
		},

		FECHAPEDIDOSTOCK: {
			type: Sequelize.DATEONLY,
			allowNull: false,
			defaultValue: Sequelize.NOW,
		},
		USUARIO_ID: DataTypes.INTEGER,
		CREATEDBY: DataTypes.INTEGER,
		UPDATEDBY: DataTypes.INTEGER,
		DELETEDBY: DataTypes.INTEGER,
		ESTADO: { type: DataTypes.INTEGER, defaultValue: 1 },
	},
	{
		sequelize,
		modelName: "pedidostock",
	}
);
module.exports = PedidoStock;
