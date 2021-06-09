'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.createTable('BlogPosts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      content: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      published: {
        type: Sequelize.DATE,
        defaultValue: new Date(),
        allowNull: false,
      },
      updated: {
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.dropTable('BlogPosts');
  }
};
