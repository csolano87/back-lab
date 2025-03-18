const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");
class Notificardespacho extends Model {}
Notificardespacho.init(
	{
		mensaje: { type: DataTypes.STRING },
		estado: { type: DataTypes.ENUM("pendiente", "confirmado", "rechazado") },
		fechaExpiracion: { type: DataTypes.DATE },
	},
	{
		sequelize,
		modelName: "notificardespacho",
	}
);

module.exports = Notificardespacho;
