const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");
class Orden extends Model {}

Orden.init(
	{
		pacienteId: DataTypes.INTEGER,
		numeroorden: DataTypes.STRING,

		embarazada: DataTypes.BOOLEAN,
		fum: { type: DataTypes.DATE, allowNull: true, defaultValue: null },

		observaciones: DataTypes.TEXT("long"),
		fechaorden: {
			type: Sequelize.DATEONLY,
			allowNull: false,
			defaultValue: Sequelize.NOW,
		},
		horaorden: {
			type: Sequelize.TIME,
			allowNull: false,
			defaultValue: Sequelize.NOW,
		},
		estado: { type: DataTypes.INTEGER, defaultValue: 1 },
	},
	{
		sequelize,
		modelName: "ordens",
	}
);

module.exports = Orden;
