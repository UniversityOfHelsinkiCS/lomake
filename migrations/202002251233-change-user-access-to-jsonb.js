module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.removeColumn('users', 'access'),
      await queryInterface.addColumn('users', 'access', {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: {}
      })
    ]
  },

  down: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.removeColumn('users', 'access'),
      await queryInterface.addColumn('users', 'access', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      })
    ]
  }
}
