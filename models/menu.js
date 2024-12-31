const { DataTypes, Model, Sequelize } = require("sequelize");

const sequelize = require("../db/connection");
class Menu extends Model {}

Menu.init(
	{
		nombre: DataTypes.STRING,
		ruta: DataTypes.STRING,
		padreid: DataTypes.INTEGER,
		orden: DataTypes.INTEGER,
		estado: { type: DataTypes.BOOLEAN, defaultValue: 1 },
	},
	{
        sequelize,
		modelName: "menus",
	}
);

module.exports = Menu;