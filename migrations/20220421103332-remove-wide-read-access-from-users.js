module.exports = {
  up: queryInterface => {
    return queryInterface.removeColumn('users', 'wide_read_access')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'wide_read_access', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    })
  },
}
