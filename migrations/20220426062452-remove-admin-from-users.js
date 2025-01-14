module.exports = {
  up: queryInterface => {
    return queryInterface.removeColumn('users', 'admin')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'admin', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    })
  },
}
