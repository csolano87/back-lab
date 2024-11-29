const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");

class Cabecera_Agen extends Model {}
Cabecera_Agen.init(
	{
		//MARTIN ICAZA
		//CODPROCEDENCIA: DataTypes.INTEGER,

		admi_id: DataTypes.STRING,
		TIPOIDENTIFICADOR: DataTypes.STRING,
		IDENTIFICADOR: DataTypes.STRING,
		NOMBRES: DataTypes.STRING,
		APELLIDO: DataTypes.STRING,
		FECHANACIMIENTO: DataTypes.DATE,
		SEXO: DataTypes.STRING,
		CODTIPOORDEN: DataTypes.STRING,
		NOMBRETIPOORDEN: DataTypes.STRING,
		PRIORIDAD: DataTypes.STRING,
		APELLIDODOCTOR: DataTypes.STRING,
		NOMBREDOCTOR: DataTypes.STRING,
		CODDOCTOR: DataTypes.STRING,
		HIS: DataTypes.STRING,
		NUMEROORDEN: DataTypes.STRING,
		TELEFONO: DataTypes.STRING,
		EMAIL: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		CONVENCIONAL: DataTypes.STRING,
		// CODTIPOORDEN: DataTypes.STRING,
		// CODSALA: DataTypes.INTEGER,
		//  CODPROCEDENCIA: DataTypes.STRING,
		CODEMBARAZADA: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		FECHACREACIONSAIS: DataTypes.STRING,

		// CODESPECIALIDADES: DataTypes.STRING,
		CODCENTROSALUD: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		CODPROVINCIA: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		DIRECCION: {
			type: DataTypes.STRING,
			allowNull: true,
		},

		/*  FECHACITA: {
             type: DataTypes.DATE,
             allowNull: true,
             defaultValue: null,
         },
         HORACITA: {
             type: DataTypes.TIME,
             allowNull: true,
             defaultValue: null,
         }, */
		OPERADOR: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		CODFLEBOTOMISTA: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		CORRELATIVO: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		CODIMPRESORA: {
			type: DataTypes.STRING,
			allowNull: true,
		},

		FECHAORDEN: {
			type: Sequelize.DATEONLY,
			allowNull: false,
			defaultValue: Sequelize.NOW,
		},
		EDAD: DataTypes.STRING,

		HORAORDEN: {
			type: Sequelize.TIME,
			allowNull: false,
			defaultValue: Sequelize.NOW,
		},
		//agreganfo hora y fecha toma
		HORATOMA: {
			type: DataTypes.TIME,
			allowNull: true,
		},
		FECHATOMA: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		LEIDOSAIS: DataTypes.STRING,
		USUARIO_ID: DataTypes.INTEGER,
		USUARIO_ID: DataTypes.INTEGER,
		CREATEDBY: DataTypes.INTEGER,
		UPDATEDBY: DataTypes.INTEGER,
		DELETEDBY: DataTypes.INTEGER,
		ESTADO: { type: DataTypes.INTEGER, defaultValue: 1 },
	},
	{
		sequelize,
		modelName: "cabecera_agen",
	}
);
module.exports = Cabecera_Agen;
