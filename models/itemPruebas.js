const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");

class Itemprueba extends Model {}

Itemprueba.init(
	{
		pruebaId: {
			type: DataTypes.INTEGER,
		},

		fecha: {
			type: Sequelize.DATEONLY,
			allowNull: false,
			defaultValue: Sequelize.NOW,
		},
		USUARIO_ID: DataTypes.INTEGER,
		CREATEDBY:DataTypes.INTEGER,
		UPDATEDBY:DataTypes.INTEGER,
		DELETEDBY:DataTypes.INTEGER,
		estado: { type: DataTypes.BOOLEAN, defaultValue: true },
	},
	{
		sequelize,
		modelName: "itemprueba",
	}
);
module.exports = Itemprueba;
