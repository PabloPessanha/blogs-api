'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     return await queryInterface.createTable('Categories', { 
       id: {
         type: Sequelize.INTEGER,
         allowNull: false,
         primaryKey: true,
         autoIncrement: true,
       },
       name: {
         type: Sequelize.STRING,
         allowNull: false,
         unique: true,
       },
      });
  },
  down: async (queryInterface, _Sequelize) => {
    return await queryInterface.dropTable('Categories');
  }
};
