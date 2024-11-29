const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");

class Itempedidostock extends Model {}

Itempedidostock.init(
	{
		ID_PRODUCTO: {
			//ID_PRODUCTO
			type: DataTypes.INTEGER,
		},

		CANTIDAD: { type: DataTypes.INTEGER },
		ENTREGADO: { type: DataTypes.INTEGER },

		fecha: {
			type: Sequelize.DATEONLY,
			allowNull: false,
			defaultValue: Sequelize.NOW,
		},
		lote: {
			type: DataTypes.STRING,
		},
		USUARIO_ID: DataTypes.INTEGER,
    CREATEDBY:DataTypes.INTEGER,
    UPDATEDBY:DataTypes.INTEGER,
    DELETEDBY:DataTypes.INTEGER,
		ESTADO: { type: DataTypes.INTEGER, defaultValue: 1 },
	},
	{
		sequelize,
		modelName: "itempedidostock",
	}
);
module.exports = Itempedidostock;
