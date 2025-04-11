const { Model, DataTypes } = require("sequelize");

const sequelize = require("../db/connection");

class PruebaOrdenImport extends Model {}
PruebaOrdenImport.init(
	{
		testID: DataTypes.INTEGER,
		testNAME: DataTypes.STRING,
		estado: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
	},
	{
		sequelize,
		modelName: "pruebaordenimport",
	}
);
module.exports = PruebaOrdenImport;
