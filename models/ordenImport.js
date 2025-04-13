const { Model, DataTypes, STRING, Sequelize } = require("sequelize");

const sequelize = require("../db/connection");

class OrdenImport extends Model {}
OrdenImport.init(
	{
		cedula: DataTypes.STRING,
		numeroorden: DataTypes.STRING,
		nombres: DataTypes.STRING,
		fechanac: DataTypes.DATE,
		sexo: DataTypes.STRING,
		historia: DataTypes.STRING,
		origen: DataTypes.STRING,
		fechaOrden: {
			type: Sequelize.DATEONLY,
			allowNull: false,
			defaultValue: Sequelize.NOW,
		},
		procedencia: DataTypes.STRING,
		doctor: DataTypes.STRING,
		estado: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
	},
	{
		sequelize,
		modelName: "ordenimport",
	}
);
module.exports = OrdenImport;
