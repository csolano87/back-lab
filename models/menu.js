const { DataTypes, Model, Sequelize } = require("sequelize");

const sequelize = require("../db/connection");
class Menu extends Model {}

Menu.init(
	{
		nombre: DataTypes.STRING,
		ruta: {type:DataTypes.STRING,allowNull: true,},
		padreid:{type: DataTypes.INTEGER,allowNull: true,},
		orden: DataTypes.INTEGER,
		estado: { type: DataTypes.BOOLEAN, defaultValue: 1 },
	},
	{
        sequelize,
		modelName: "menus",
	}
);

module.exports = Menu;