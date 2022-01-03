module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.removeColumn('users', 'special_group'),
      await queryInterface.addColumn('users', 'special_group', {
        type: Sequelize.JSONB,
        defaultValue: {},
      }),
    ]
  },

  down: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.removeColumn('users', 'special_group'),
      await queryInterface.addColumn('users', 'special_group', {
        type: Sequelize.JSONB,
      }),
    ]
  },
}
