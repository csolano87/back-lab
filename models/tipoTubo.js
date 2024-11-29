const { Sequelize, DataTypes, Model } = require("sequelize");
const db = require("../db/connection");
//const Cabecera = require('./cabecera');

const Envase = db.define(
	"Envase",
	{
		descripcion: {
			type: DataTypes.STRING,
			//required:[true,'El rol es obligatorio']
		},
		codigo: {
			type: DataTypes.STRING,
		},
		abreviatura: {
			type: DataTypes.STRING,
		},
		volumenneto: {
			type: DataTypes.INTEGER,
		},
		volumenprueba: {
			type: DataTypes.INTEGER,
		},
		USUARIO_ID: DataTypes.INTEGER,
    CREATEDBY:DataTypes.INTEGER,
    UPDATEDBY:DataTypes.INTEGER,
    DELETEDBY:DataTypes.INTEGER,
		estado: {
			type: DataTypes.BOOLEAN,
			defaultValue: 1,
		},
	},
	{
		freezeTableName: true,
		tableName: "envase",
		timestamps: false,
	}
);
module.exports = Envase;
