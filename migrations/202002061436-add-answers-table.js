module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('answers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      programme: {
        type: Sequelize.STRING
      },
      data: {
        type: Sequelize.JSONB
      },
      year: {
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }),
  down: (queryInterface) => queryInterface.dropTable('answers')
}
