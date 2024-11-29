const { DataTypes, Model } = require("sequelize");
const sequelize = require("../db/connection");

class Bodega extends Model {}

Bodega.init(
	{
		NOMBRE: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		DESCRIPCION: {
			type: DataTypes.TEXT,
		},
		ESTADO: {
			type: DataTypes.INTEGER,
			defaultValue: 1,
		},
	},
	{
		sequelize,
		modelName: "bodega",
	}
);

module.exports = Bodega;
