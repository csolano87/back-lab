const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");
const Usuario = require("./usuarios");


class Prueba extends Model { }
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
		/* creadorId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Usuario,
				key: 'id'
			}
		}, */
		fechaordenreportada: {
			type: Sequelize.DATEONLY,
			allowNull: true,
		},
		horaordenreportada: {
			type: Sequelize.TIME,
			allowNull: true,

		},
	/* 	reportadaId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Usuario,
				key: 'id'
			}
		}, */
		fechaordenvalidada: {
			type: Sequelize.DATEONLY,
			allowNull: true,
		},
		horaordenvalidada: {
			type: Sequelize.TIME,
			allowNull: true,

		},
		/* validadaId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Usuario,
				key: 'id'
			}
		}, */

		estado: {
			type: DataTypes.INTEGER, // Cambiado de BOOLEAN a INTEGER
		},
	},

	{
		sequelize,
		modelName: "pruebas",
		hooks: {
			beforeCreate: (instance) => {
				console.log(`modelo`, instance.estado)
				if (instance.estado === 2 || instance.estado === '2') {
					instance.fechaorden = null;
					instance.horaorden = null;
				}
			},
		},
	}
);

module.exports = Prueba;
