const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");

class Itempedido extends Model {}

Itempedido.init(
	{
		ID_PRODUCTO: {
			//ID_PRODUCTO
			type: DataTypes.INTEGER,
		},

		CANTIDAD: { type: DataTypes.INTEGER },

		fecha: {
			type: Sequelize.DATEONLY,
			allowNull: false,
			defaultValue: Sequelize.NOW,
		},
		USUARIO_ID: DataTypes.INTEGER,
		CREATEDBY:DataTypes.INTEGER,
		UPDATEDBY:DataTypes.INTEGER,
		DELETEDBY:DataTypes.INTEGER,
		ESTADO: { type: DataTypes.INTEGER, defaultValue: 1 },
	},
	{
		sequelize,
		modelName: "itempedido",
	}
);
module.exports = Itempedido;
