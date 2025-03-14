const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");

class Stocktemp extends Model {}

Stocktemp.init(
	{
		guia: {
			type: DataTypes.STRING,
		},

		fechaIngreso: {
			type: Sequelize.DATEONLY,
			allowNull: false,
			defaultValue: Sequelize.NOW,
		},
		usuario: { type: DataTypes.INTEGER },
		USUARIO_ID: DataTypes.INTEGER,
		CREATEDBY: DataTypes.INTEGER,
		UPDATEDBY: DataTypes.INTEGER,
		DELETEDBY: DataTypes.INTEGER,
		ESTADO: { type: DataTypes.INTEGER, defaultValue: 1 },
	},
	{
		sequelize,
		modelName: "stocktemp",
	}
);
module.exports = Stocktemp;
