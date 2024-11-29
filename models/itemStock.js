const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");

class ItemStock extends Model {}

ItemStock.init(
	{
		referencia: {
			type: DataTypes.STRING,
		},
		descripcion: {
			type: DataTypes.STRING,
		},
		lote: { type: DataTypes.STRING },
		caducidad: { type: DataTypes.DATE },
		cantidad: { type: DataTypes.INTEGER },
		cantidad_recibida: { type: DataTypes.INTEGER },
		fabricante: { type: DataTypes.STRING },
		sanitario: { type: DataTypes.STRING },
		comentario: { type: DataTypes.STRING },
		USUARIO_ID: DataTypes.INTEGER,
		CREATEDBY: DataTypes.INTEGER,
		UPDATEDBY: DataTypes.INTEGER,
		DELETEDBY: DataTypes.INTEGER,
		ESTADO: { type: DataTypes.INTEGER, defaultValue: 1 },
	},
	{
		sequelize,
		modelName: "itemstock",
	}
);
module.exports = ItemStock;
