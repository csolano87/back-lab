"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex("cabeceras", ["DLCPRO"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex("cabeceras", ["DLCPRO"]);
  },
};
