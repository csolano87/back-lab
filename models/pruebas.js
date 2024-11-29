const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");

class Prueba extends Model {}
Prueba.init(
	{
		resultado: DataTypes.STRING,
		fechaorden: {
			type: Sequelize.DATEONLY,
			allowNull: true,
			defaultValue: Sequelize.NOW,
		},
		horaorden: {
			type: Sequelize.TIME,
			allowNull: true,
			defaultValue: Sequelize.NOW,
		},

		estado: {
			type: DataTypes.INTEGER, // Cambiado de BOOLEAN a INTEGER
		},
	},

	{
		sequelize,
		modelName: "pruebas",
		hooks: {
			beforeCreate: (instance) => {
				console.log(`modelo`,instance.estado)
				if (instance.estado === 2 || instance.estado === '2' ) {
					instance.fechaorden = null;
					instance.horaorden = null;
				}
			},
		},
	}
);

module.exports = Prueba;
