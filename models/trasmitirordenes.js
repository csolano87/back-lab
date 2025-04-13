const { Model, STRING, DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");
const { types } = require("pg");

class Trasmitirorden extends Model {}
Trasmitirorden.init(
	{
		numeroorden: STRING,
		fechaOrden: {
			types: DataTypes.DATEONLY,
			allowNull: false,
			defaultValue: Sequelize.NOW,
		},
		estado: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
	},
	{
		sequelize,
		modelName: "trasmitirorden",
	}
);
