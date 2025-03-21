const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");
class Despachopedido extends Model {}

Despachopedido.init(
	{
        lote: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          cantidad_despachada: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
        fechadespacho: {
			type: Sequelize.DATE,
			allowNull: false,
			defaultValue: Sequelize.NOW,
		},
    },
	{
		sequelize,
		modelName: "despachopedido",
	}
);

module.exports = Despachopedido;
