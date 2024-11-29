const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");


class Transferencia extends Model {}

Transferencia.init(
	{
		PRODUCTO_ID: {
			type: DataTypes.INTEGER,
			references: {
				model: 'productos',
				key: 'id'
			}
		},
		BODEGA_ORIGEN_ID: {
			type: DataTypes.INTEGER,
			references: {
				model: 'bodegas',
				key: 'id'
			}
		},
		UBICACION_ORIGEN: {
			type: DataTypes.STRING,
		},
		BODEGA_DESTINO_ID: {
			type: DataTypes.INTEGER,
			references: {
				model: 'bodegas',
				key: 'id'
			}
		},
		UBICACION_DESTINO: {
			type: DataTypes.STRING,
		},
		CANTIDAD: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		FECHA: {
			type: DataTypes.DATE,
			defaultValue: Sequelize.NOW,
		},
		CREATEDBY: DataTypes.INTEGER,
		UPDATEDBY: DataTypes.INTEGER,
		DELETEDBY: DataTypes.INTEGER,
		ESTADO: { 
			type: DataTypes.INTEGER, 
			defaultValue: 1 
		},
	},
	{
		sequelize,
		modelName: "transferencias",
	}
);

module.exports = Transferencia;
