const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");

class Proceso extends Model {}
Proceso.init(
	{
		institucion: DataTypes.STRING,
		codigo: DataTypes.STRING,
		linkproceso: DataTypes.STRING,
		tiempoconsumo: DataTypes.STRING,
		determinacion: DataTypes.STRING,
		presupuesto: DataTypes.STRING,
		entregacarpeta: DataTypes.STRING,
		//ASIGNADO:DataTypes.INTEGER,
		areas: {
			type: DataTypes.TEXT,
			allowNull: false,
			get() {
				const rawValue = this.getDataValue("areas");
				return rawValue ? JSON.parse(rawValue) : [];
			},
			set(value) {
				this.setDataValue("areas", JSON.stringify(value));
			},
		},
		terceraopcion: DataTypes.STRING,
		sistema: DataTypes.STRING,
		equipoprincipal: {
			type: DataTypes.JSON, // Usamos JSON para almacenar el objeto JSON
			allowNull: false,
			get() {
				const rawValue = this.getDataValue("equipoprincipal");
				return rawValue ? JSON.parse(rawValue) : {};
			},
			set(value) {
				this.setDataValue("equipoprincipal", JSON.stringify(value));
			},
		},
		equipobackup: {
			type: DataTypes.JSON, // Usamos JSON para almacenar el objeto JSON
			allowNull: false,
			get() {
				const rawValue = this.getDataValue("equipobackup");
				return rawValue ? JSON.parse(rawValue) : {};
			},
			set(value) {
				this.setDataValue("equipobackup", JSON.stringify(value));
			},
		},
		observacion: DataTypes.TEXT("long"),
		licenciaEquiposHematologicos: {
			type: DataTypes.TEXT,
			allowNull: false,
			get() {
				const licenValue = this.getDataValue("licenciaEquiposHematologicos");
				return licenValue ? JSON.parse(licenValue) : [];
			},
			set(value) {
				this.setDataValue(
					"licenciaEquiposHematologicos",
					JSON.stringify(value)
				);
			},
		},
		usuarioId: DataTypes.STRING,
		USUARIO_ID: DataTypes.INTEGER,
    CREATEDBY:DataTypes.INTEGER,
    UPDATEDBY:DataTypes.INTEGER,
    DELETEDBY:DataTypes.INTEGER,
		ESTADO: { type: DataTypes.INTEGER, defaultValue: 1 },
		//ESTADOBI: { type: DataTypes.BOOLEAN },
	},

	{
		sequelize,
		modelName: "proceso",
	}
);
module.exports = Proceso;
