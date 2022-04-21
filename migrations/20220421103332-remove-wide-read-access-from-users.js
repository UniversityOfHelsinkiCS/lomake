module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'wide_read_access')
  },

  down: queryInterface => {
    return queryInterface.addColumn('users', 'wide_read_access', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    })
  },
}
