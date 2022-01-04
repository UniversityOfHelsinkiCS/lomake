module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'last_login', {
      type: Sequelize.DATE,
    })
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'last_login')
  },
}
