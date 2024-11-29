const { Sequelize } = require("sequelize");
//const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const moment = require("moment-timezone");

// Configura la zona horaria a 'America/Guayaquil' (o la zona horaria que desees)
moment.tz.setDefault("America/Guayaquil");
const db = new Sequelize("oe", "root", "admin1234", {
	host: "localhost",
	timezone: '-05:00',
	dialect: "mysql",
});


module.exports = db;
