module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('tokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      url: {
        type: Sequelize.STRING
      },
      programme: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.ENUM('ADMIN', 'WRITE', 'READ')
      },
      usage_counter: {
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
  down: (queryInterface) => queryInterface.dropTable('tokens')
}
