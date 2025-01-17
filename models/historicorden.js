const { Model, DataTypes } = require("sequelize");

const sequelize = require("../db/connection");


class Historicorden extends Model {}
Historicorden.init({

    accion: DataTypes.TEXT('long'),

    detalles: {
        type: DataTypes.TEXT('long')
    }

},
    {
        sequelize,
        modelName: "historicordens"
    })
module.exports = Historicorden;