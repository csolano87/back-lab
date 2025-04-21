const { Model, DataTypes } = require("sequelize");

const sequelize = require("../db/connection");

class PruebaOrdenImport extends Model {}
PruebaOrdenImport.init(
	{
		testID: DataTypes.INTEGER,
		TestABREV:DataTypes.STRING,
		testNAME: DataTypes.STRING,
		resultado:DataTypes.FLOAT,
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
