const { Model } = require("sequelize");


const sequelize = require("../db/connection");
class MenuRole extends Model{}
MenuRole.init({

},{
    sequelize,
    modelName:"menuroles"
});

module.exports=MenuRole